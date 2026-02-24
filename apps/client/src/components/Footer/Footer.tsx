import "./footer.css";

const Footer = () => {
  return (
    <div className="footer">
      <div className="footer-Box">
        <div className="footer-logo-container">
          <img src="/logo.png" alt="" className="footer-logo" />
          <p className="footer-title">FERFCO SHOP</p>
        </div>
        <p className="footer-text"> © 2025 FERFCO SHOP</p>
        <p className="footer-text">All rights reserved</p>
      </div>
      <div className="footer-Box">
        <p className="footer-title">Links</p>
        <p className="footer-text">Homepage</p>
        <p className="footer-text">Contact</p>
        <p className="footer-text">Terms of service</p>
        <p className="footer-text">Privacy policy</p>
      </div>
      <div className="footer-Box">
        <p className="footer-title">Products</p>
        <p className="footer-text">All products</p>
        <p className="footer-text">New arrivals</p>
        <p className="footer-text">Best sellers</p>
        <p className="footer-text">Sale</p>
      </div>

      <div className="footer-Box">
        <p className="footer-title">Company</p>
        <p className="footer-text">About</p>
        <p className="footer-text">Contact</p>
        <p className="footer-text">Blog</p>
        <p className="footer-text">Afiliate program</p>
      </div>
    </div>
  );
};

export default Footer;
