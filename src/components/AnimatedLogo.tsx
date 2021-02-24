import { ReactComponent as LogoBlades } from "../assets/images/logo-blades.svg";
import { ReactComponent as LogoBox } from "../assets/images/logo-box.svg";

export default function AnimatedLogo() {
  return (
    <div className="logoContainer">
      <LogoBox className="logoBox" />
      <LogoBlades className="logoBlades" />
    </div>
  );
}
