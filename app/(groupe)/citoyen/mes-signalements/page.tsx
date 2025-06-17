import GetMyIncident from "@/components/GetMyIncident"
import Navbar from "@/components/Navbar"

export default function MesSignalementsPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <GetMyIncident />
        </div>
    )
}