import React, {useEffect} from 'react';
import {BrowserRouter, Navigate, Route, Routes, useNavigate, useSearchParams} from 'react-router-dom';
import {AuthProvider} from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import {GuestHome} from './components/guest-home';
import {AdminLogin} from './components/admin/admin-login.component';
import {AdminLayout} from './components/admin/admin-layout.component';
import {AdminDashboardContent} from './components/admin/admin-dashboard-content.component';
import {AdminsContent} from './components/admin/admins-content.component';
import {InvitationCards} from './components/admin/invitation-cards.component';
import {InviteesReport} from './components/admin/invitees-report.component';
import {InviteePledges} from './components/invitees-pledges.component';
import './App.css';
import {InvitationCard} from "./components/invitation-card/invitation-card.component";


const AppWrapper = (props: any) => {
    const [searchParams] = useSearchParams();
    const path = searchParams.get('path') ?? null;
    const navigate = useNavigate();
    useEffect(() => {
        if (path) {
            navigate(path);
        }
    });
    return <>{props.children}</>
}


function App() {


    return (
        <AuthProvider>
            <BrowserRouter basename="/victors-wedding">
                <AppWrapper>
                    <div className="app">
                        <Routes>
                            {/* Guest Routes */}
                            <Route path="/" element={<GuestHome/>}/>
                            <Route path="invitees" element={<InviteePledges/>}/>
                            <Route path="pledges/:cardId" element={<InviteePledges/>}/>
                            <Route path="pledges" element={<InviteePledges/>}/>
                            <Route path="invitation-card/:id" element={<InvitationCard/>}/>

                            {/* Admin Login Route */}
                            <Route path="admin/login" element={<AdminLogin/>}/>

                            {/* Protected Admin Routes with Sidebar Layout */}
                            <Route
                                path="admin"
                                element={
                                    <ProtectedRoute>
                                        <AdminLayout/>
                                    </ProtectedRoute>
                                }
                            >
                                <Route index element={<Navigate to="dashboard" replace/>}/>
                                <Route path="dashboard" element={<AdminDashboardContent/>}/>
                                <Route path="admins" element={<AdminsContent/>}/>
                                <Route path="invitees" element={<InvitationCards/>}/>
                                <Route path="reports" element={<InviteesReport/>}/>
                                <Route path="pledges" element={<InviteePledges/>}/>
                            </Route>

                            {/* Catch all route */}
                            <Route path="*" element={<Navigate to="/" replace/>}/>
                        </Routes>
                    </div>
                </AppWrapper>
            </BrowserRouter>
        </AuthProvider>

    )
}

export default App;
