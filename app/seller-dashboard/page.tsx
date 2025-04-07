import { redirect } from "next/navigation"
import { currentUser } from "@clerk/nextjs/server"
import AdminDashboard from "./admin-dashboard"

const ADMIN_EMAIL = 'jimmytole1262@gmail.com'

export default async function SellerDashboardPage() {
  const user = await currentUser()
  
  // If not logged in, redirect to sign-in
  if (!user) {
    redirect("/sign-in")
  }

  // Check if user is admin (in a real app, check against your admin database)
  const isAdmin = user.emailAddresses.some(
    (email: { emailAddress: string }) => email.emailAddress === ADMIN_EMAIL
  )

  // If not admin, redirect to home
  if (!isAdmin) {
    redirect("/")
  }

  return <AdminDashboard />
}
