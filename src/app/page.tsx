import SzczegolowyFormularz from "@/app/comps/form";
import Footer from "@/app/comps/footer";
import Navbar from "@/app/comps/navbar";


export default function Main(){
  return (
      <main className="main">
        <Navbar/>
        <SzczegolowyFormularz/>
        <Footer/>
      </main>
  )
}