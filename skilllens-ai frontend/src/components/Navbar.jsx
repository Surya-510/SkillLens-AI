import {FaBell} from "react-icons/fa";
export default function Navbar(){
 const name=localStorage.getItem("username")||"Guest";
 return <header className="topbar"><div><span className="muted">Welcome back, </span><b>{name}</b></div><div className="user-pill"><FaBell/> <span>{localStorage.getItem("role")}</span></div></header>
}
