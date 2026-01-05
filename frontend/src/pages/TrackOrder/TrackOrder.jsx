import React, { useEffect, useState, useContext } from 'react'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios'
import { useParams, useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import './TrackOrder.css'
import { toast } from 'react-toastify'

// --- CẤU HÌNH ICON ---
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;
const shopIcon = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/273/273177.png",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
});
const customerIcon = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/609/609803.png",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
});
const bikeIcon = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/713/713311.png",
    iconSize: [50, 50],
    iconAnchor: [25, 25],
});

// --- COMPONENT SHIPPER ---
// eslint-disable-next-line react/prop-types
const ShipperAnimation = ({ start, end }) => {
    const [position, setPosition] = useState(start);

    useEffect(() => {
        if (!start || !end) return;
        const duration = 12000;
        const startTime = performance.now();

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // eslint-disable-next-line react/prop-types
            const lat = start.lat + (end.lat - start.lat) * progress;
            // eslint-disable-next-line react/prop-types
            const lng = start.lng + (end.lng - start.lng) * progress;

            setPosition({ lat, lng });

            if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    }, [start, end]);

    return (
        <>
            <Polyline positions={[start, end]} pathOptions={{ color: 'tomato', dashArray: '10, 10', opacity: 0.6 }} />
            <Marker position={position} icon={bikeIcon} zIndexOffset={1000}>
                <Popup>Shipper đang tới! 🛵💨</Popup>
            </Marker>
        </>
    );
};

// --- COMPONENT CHÍNH ---
const TrackOrder = () => {
    const { orderId } = useParams();
    const { url, token } = useContext(StoreContext);
    const navigate = useNavigate();

    const [order, setOrder] = useState(null);
    const [userPos, setUserPos] = useState(null);

    // Tọa độ Shops (Đà Nẵng)
    const SHOP_POS = { lat: 16.061043, lng: 108.221512 };

    // --- HÀM TÌM TỌA ĐỘ (CÓ CHỐNG LỖI CORS) ---
    const findCoordinates = async (addressString) => {
        try {
            console.log("Đang tìm: " + addressString);
            // Dùng fetch thuần, không thêm header để tránh bị chặn Preflight
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addressString)}`
            );

            if (response.ok) {
                const data = await response.json();
                if (data && data.length > 0) {
                    const lat = parseFloat(data[0].lat);
                    const lon = parseFloat(data[0].lon);
                    setUserPos({ lat: lat, lng: lon });
                    return;
                }
            }
            throw new Error("Không tìm thấy");
        } catch (error) {
            console.warn("Lỗi bản đồ hoặc bị chặn CORS. Dùng vị trí mặc định.");
            // Lỗi thì dùng tọa độ trung tâm Đà Nẵng
            setUserPos({ lat: 16.0544, lng: 108.2022 });
        }
    };

    const fetchOrder = async () => {
        try {
            const response = await axios.post(url + "/api/order/userorders", {}, {headers: {token}});
            if(response.data.success) {
                const currentOrder = response.data.data.find(o => o._id === orderId);
                if (currentOrder) {
                    setOrder(currentOrder);

                    let addressToSearch = "";
                    if (currentOrder.address.full_address) {
                        addressToSearch = currentOrder.address.full_address;
                    } else {
                        addressToSearch = `${currentOrder.address.tenDuong}, ${currentOrder.address.phuongXa}, ${currentOrder.address.tinh}`;
                    }
                    findCoordinates(addressToSearch);
                }
            }
        } catch (error) {
            console.error(error);
            toast.error("Lỗi tải đơn hàng");
        }
    }

    useEffect(() => {
        if(token) fetchOrder();
    }, [token, orderId]);

    const handleConfirmReceived = async () => {
        if(window.confirm("Bạn xác nhận đã nhận được món ăn?")) {
            try {
                // Gọi API báo cho Backend
                const response = await axios.post(url + "/api/order/update", {
                    orderId: orderId,
                    status: "Đã giao hàng"
                }, {headers: {token}});

                if (response.data.success) {
                    toast.success("Đơn hàng hoàn tất! Chúc ngon miệng 😋");
                    navigate('/myorders');
                } else {
                    toast.error("Có lỗi xảy ra, thử lại sau!");
                }
            } catch (error) {
                console.error(error);
                toast.error("Lỗi kết nối Server");
            }
        }
    }

    if(!order || !userPos) return <div className="loading" style={{padding:'50px', textAlign:'center'}}>Đang tải bản đồ...</div>;

    return (
        <div className="track-order-page">
            <div className="track-header">
                <h2>Theo dõi đơn hàng</h2>
                <p>Đang giao tới: <b>{order.address.full_address || order.address.tenDuong}</b></p>
                <div className="status-badge">{order.status}</div>
            </div>

            <div className="map-container-large">
                {/* Quan trọng: Thêm key để Map tự reset khi có tọa độ mới */}
                <MapContainer key={JSON.stringify(userPos)} center={SHOP_POS} zoom={13} style={{height: '600px', width: '100%'}}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                    <Marker position={SHOP_POS} icon={shopIcon}>
                        <Popup>
                            <div style={{textAlign: 'center', fontWeight: 'bold'}}>
                                🏪 Cửa hàng<br/>(Xuất phát)
                            </div>
                        </Popup>
                    </Marker>

                    <Marker position={userPos} icon={customerIcon}>
                        <Popup>
                            <div style={{textAlign: 'center', fontWeight: 'bold'}}>
                                🏠 Nhà bạn<br/>(Điểm đến)
                            </div>
                        </Popup>
                    </Marker>

                    <ShipperAnimation start={SHOP_POS} end={userPos} />
                </MapContainer>
            </div>

            <div className="track-actions">
                <p>Shipper đang trên đường giao món ăn đến cho bạn...</p>
                <button onClick={handleConfirmReceived} className="confirm-btn">
                    Đã nhận được hàng
                </button>
            </div>
        </div>
    )
}

export default TrackOrder;