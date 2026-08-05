export default function PhoneFrame({ children }) {
  return (
    <div className="bezel">
      <div className="screen">
        <div className="statusbar">
          <span>9:41</span>
          <span className="dots">
            <span>●●●</span><span>Wi-Fi</span><span>100%</span>
          </span>
        </div>
        {children}
      </div>
    </div>
  )
}
