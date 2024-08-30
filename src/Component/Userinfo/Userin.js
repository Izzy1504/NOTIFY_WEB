import React, { useState, useEffect } from "react";
import "./Userin.css";

const Userin = () => {
  // Giả sử đây là dữ liệu tài khoản hiện tại từ API hoặc dữ liệu mô phỏng
  const [account, setAccount] = useState({
    name: "Tên tài khoản",  // Tên của tài khoản
    avatarUrl: "avatar-url", // URL ảnh avatar của tài khoản
    plan: "Notify-vip",    // Hoặc "Spotify Premium" tùy theo gói
  });

  // Giả lập việc lấy thông tin tài khoản từ API (chỉ để minh họa)
  useEffect(() => {
    // fetch API để lấy thông tin tài khoản từ backend (giả lập)
    // setAccount({
    //   name: "John Doe",
    //   avatarUrl: "https://example.com/johndoe-avatar.jpg",
    //   plan: "Spotify Premium"
    // });
  }, []);

  const sections = [
    {
      title: "Tài khoản",
      items: [
        { label: "Quản lý gói đăng ký", icon: "🔧" },
        { label: "Chỉnh sửa hồ sơ", icon: "✏️" },
        { label: "Khôi phục danh sách phát", icon: "⏪" },
      ],
    },
    {
      title: "Thanh toán",
      items: [
        { label: "Lịch sử đặt hàng", icon: "📝" },
        { label: "Thẻ thanh toán đã lưu", icon: "💳" },
        { label: "Đổi", icon: "🔄" },
      ],
    },
    {
      title: "Bảo mật và quyền riêng tư",
      items: [
        { label: "Quản lý ứng dụng", icon: "🔒" },
        { label: "Cài đặt thông báo", icon: "📢" },
        { label: "Cài đặt quyền riêng tư", icon: "🔐" },
        { label: "Chỉnh sửa phương thức đăng nhập", icon: "🔑" },
        { label: "Đăng xuất ở mọi nơi", icon: "🚪" },
      ],
    },
    {
      title: "Trợ giúp",
      items: [{ label: "Nhóm hỗ trợ của Notify", icon: "🆘" }],
    },
  ];

  return (
    <div className="userin-container">
      <div className="header">
        <div className="premium-banner">
          {/* <img src="https://th.bing.com/th/id/OIP.f2UzDrouMmPOyIlDPg3nbAHaNK?rs=1&pid=ImgDetMain" alt="Premium" /> */}
          <div className="premium-info">
            <h3>Bạn đang dùng gói VIP</h3>
           
            <button>Home</button>
          </div>
        </div>

        <div className="account-status">
          <div className="account-details">
            <img className="avatar" src={account.avatarUrl} alt="Avatar" />
            <h2>{account.name}</h2>
          </div>
          <p>{account.plan}</p>
        </div>
      </div>

      {sections.map((section, index) => (
        <div key={index} className="section">
          <h3>{section.title}</h3>
          <ul>
            {section.items.map((item, idx) => (
              <li key={idx}>
                <span>{item.icon}</span>
                <p>{item.label}</p>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default Userin;
