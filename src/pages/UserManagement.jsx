import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { createClient } from "@supabase/supabase-js";
import { MdEdit, MdDelete, MdPersonAdd, MdSearch } from "react-icons/md";
import { BsFillExclamationDiamondFill, BsAward } from "react-icons/bs";
import { ImSpinner2 } from "react-icons/im";
import Modal from "../components/Modal";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";

export default function UserManagement() {
    const { user: currentUser } = useOutletContext();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterMemberStatus, setFilterMemberStatus] = useState("all");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Modal states
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    // Form states
    const [addForm, setAddForm] = useState({ 
        fullName: "", 
        email: "", 
        password: "", 
        role: "member",
        membershipStatus: "free",
        membershipPoints: 0
    });
    const [editForm, setEditForm] = useState({ 
        id: "", 
        fullName: "", 
        role: "member",
        membershipStatus: "free",
        membershipPoints: 0
    });
    const [selectedUser, setSelectedUser] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    // Fetch users
    const fetchUsers = async () => {
        setLoading(true);
        setError("");
        try {
            const { data, error: fetchError } = await supabase
                .from("profiles")
                .select("*")
                .order("created_at", { ascending: false });

            if (fetchError) {
                setError("Gagal memuat daftar user: " + fetchError.message);
            } else {
                setUsers(data || []);
            }
        } catch (err) {
            setError("Terjadi kesalahan saat mengambil data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Create User (with temp client so admin session isn't overwritten)
    const handleAddUser = async (e) => {
        e.preventDefault();
        setActionLoading(true);
        setError("");
        setSuccess("");

        const tempUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL;
        const tempKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!tempUrl || !tempKey) {
            setError("Konfigurasi Supabase URL atau Anon Key tidak lengkap.");
            setActionLoading(false);
            return;
        }

        try {
            const tempSupabase = createClient(tempUrl, tempKey, {
                auth: {
                    persistSession: false,
                    autoRefreshToken: false
                }
            });

            const { data, error: signUpError } = await tempSupabase.auth.signUp({
                email: addForm.email,
                password: addForm.password,
                options: {
                    data: {
                        full_name: addForm.fullName,
                        role: addForm.role
                    }
                }
            });

            if (signUpError) {
                setError(signUpError.message);
            } else if (data.user) {
                // Update additional CRM details if user was successfully registered
                const { error: updateError } = await supabase
                    .from("profiles")
                    .update({
                        membership_status: addForm.membershipStatus,
                        membership_points: parseInt(addForm.membershipPoints) || 0
                    })
                    .eq("id", data.user.id);

                if (updateError) {
                    setError("User terdaftar tetapi gagal menyimpan data CRM: " + updateError.message);
                } else {
                    setSuccess(`User baru ${addForm.fullName} berhasil ditambahkan!`);
                    setAddForm({ fullName: "", email: "", password: "", role: "member", membershipStatus: "free", membershipPoints: 0 });
                    setIsAddModalOpen(false);
                    fetchUsers();
                }
            }
        } catch (err) {
            setError(err.message || "Gagal membuat user.");
        } finally {
            setActionLoading(false);
        }
    };

    // Update User Profile & CRM data
    const handleEditUser = async (e) => {
        e.preventDefault();
        setActionLoading(true);
        setError("");
        setSuccess("");

        try {
            const { error: updateError } = await supabase
                .from("profiles")
                .update({
                    full_name: editForm.fullName,
                    role: editForm.role,
                    membership_status: editForm.membershipStatus,
                    membership_points: parseInt(editForm.membershipPoints) || 0
                })
                .eq("id", editForm.id);

            if (updateError) {
                setError(updateError.message);
            } else {
                setSuccess("Data user & CRM berhasil diperbarui!");
                setIsEditModalOpen(false);
                fetchUsers();
            }
        } catch (err) {
            setError("Gagal mengupdate user.");
        } finally {
            setActionLoading(false);
        }
    };

    // Delete User
    const handleDeleteUser = async () => {
        setActionLoading(true);
        setError("");
        setSuccess("");

        try {
            const { error: deleteError } = await supabase
                .from("profiles")
                .delete()
                .eq("id", selectedUser.id);

            if (deleteError) {
                setError(deleteError.message);
            } else {
                setSuccess("User berhasil dihapus dari database!");
                setIsDeleteModalOpen(false);
                setSelectedUser(null);
                fetchUsers();
            }
        } catch (err) {
            setError("Gagal menghapus user.");
        } finally {
            setActionLoading(false);
        }
    };

    const openEditModal = (user) => {
        setEditForm({ 
            id: user.id, 
            fullName: user.full_name, 
            role: user.role,
            membershipStatus: user.membership_status || "free",
            membershipPoints: user.membership_points || 0
        });
        setIsEditModalOpen(true);
    };

    const openDeleteModal = (user) => {
        setSelectedUser(user);
        setIsDeleteModalOpen(true);
    };

    // Filter users by search query and membership status
    const filteredUsers = users.filter((u) => {
        const query = searchQuery.toLowerCase();
        const matchesQuery = (
            u.full_name?.toLowerCase().includes(query) ||
            u.email?.toLowerCase().includes(query) ||
            u.role?.toLowerCase().includes(query)
        );
        const matchesMemberStatus = 
            filterMemberStatus === "all" || 
            u.membership_status === filterMemberStatus;

        return matchesQuery && matchesMemberStatus;
    });

    const formatDate = (dateString) => {
        if (!dateString) return "-";
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    };

    return (
        <div className="w-full space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-left">
                <div>
                    <p className="text-sm text-gray-500">Kelola hak akses, loyalitas poin, dan paket member staf & pelanggan</p>
                </div>
                {currentUser?.role === "admin" && (
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-ocean-green text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 hover:shadow-md transition-all cursor-pointer shadow-sm w-fit"
                    >
                        <MdPersonAdd className="text-lg" />
                        Tambah Anggota Baru
                    </button>
                )}
            </div>

            {/* Notifications */}
            {error && (
                <div className="bg-red-50 border border-red-200 p-4 text-sm text-red-600 rounded-xl flex items-center shadow-sm">
                    <BsFillExclamationDiamondFill className="text-red-500 mr-3 text-lg flex-shrink-0" />
                    <span>{error}</span>
                </div>
            )}
            {success && (
                <div className="bg-emerald-50 border border-emerald-200 p-4 text-sm text-emerald-600 rounded-xl flex items-center shadow-sm">
                    <MdPersonAdd className="text-emerald-500 mr-3 text-lg flex-shrink-0" />
                    <span>{success}</span>
                </div>
            )}

            {/* Search and Table Box */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden text-left">
                {/* Search & Filter Header */}
                <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/50">
                    <div className="flex flex-wrap items-center gap-3 flex-1 max-w-2xl">
                        {/* Search Query */}
                        <div className="relative flex-1 min-w-[200px]">
                            <MdSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Cari nama, email, atau role..."
                                className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-ocean-green/20 focus:border-ocean-green outline-none transition-all placeholder-gray-400 shadow-inner"
                            />
                        </div>
                        {/* Filter Status Member */}
                        <select
                            value={filterMemberStatus}
                            onChange={(e) => setFilterMemberStatus(e.target.value)}
                            className="px-3 py-2 text-sm bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-ocean-green/20 focus:border-ocean-green text-gray-700"
                        >
                            <option value="all">Semua Status Member</option>
                            <option value="free">Member: Free</option>
                            <option value="premium">Member: Premium</option>
                            <option value="vip">Member: VIP</option>
                        </select>
                    </div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">
                        Total: {filteredUsers.length} User
                    </span>
                </div>

                {/* Users Table */}
                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-500">
                            <ImSpinner2 className="animate-spin text-ocean-green text-3xl" />
                            <span className="text-sm font-medium">Memuat data user...</span>
                        </div>
                    ) : filteredUsers.length === 0 ? (
                        <div className="text-center py-20 text-gray-400">
                            <p className="text-sm font-medium">Tidak ada data user ditemukan</p>
                        </div>
                    ) : (
                        <Table className="w-full text-sm text-left">
                            <TableHeader className="bg-gray-50 text-gray-500 font-bold border-b border-gray-100 text-xs uppercase tracking-wider">
                                <TableRow>
                                    <TableHead className="px-6 py-4">Nama Lengkap</TableHead>
                                    <TableHead className="px-6 py-4">Email</TableHead>
                                    <TableHead className="px-6 py-4">Role</TableHead>
                                    <TableHead className="px-6 py-4">Member Tier</TableHead>
                                    <TableHead className="px-6 py-4 text-center">Poin Loyalitas</TableHead>
                                    <TableHead className="px-6 py-4">Tanggal Terdaftar</TableHead>
                                    {currentUser?.role === "admin" && (
                                        <TableHead className="px-6 py-4 text-center">Aksi</TableHead>
                                    )}
                                </TableRow>
                            </TableHeader>
                            <TableBody className="divide-y divide-gray-100 font-medium text-gray-700">
                                {filteredUsers.map((u) => {
                                    const userInitials = u.full_name
                                        ? u.full_name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase()
                                        : "U";

                                    // Role color mapping
                                    let roleColor = "bg-gray-100 text-gray-600 border border-gray-200";
                                    if (u.role === "admin") roleColor = "bg-red-50 text-red-600 border border-red-150";
                                    else if (u.role === "manager") roleColor = "bg-indigo-50 text-indigo-600 border border-indigo-150";
                                    else if (u.role === "staff") roleColor = "bg-emerald-50 text-emerald-600 border border-emerald-150";
                                    else if (u.role === "member") roleColor = "bg-teal-50 text-teal-600 border border-teal-150";

                                    // Member status color mapping
                                    let statusColor = "bg-gray-100 text-gray-500 border border-gray-200";
                                    if (u.membership_status === "vip") statusColor = "bg-red-50 text-red-700 border border-red-150 font-bold";
                                    else if (u.membership_status === "premium") statusColor = "bg-indigo-50 text-indigo-700 border border-indigo-150 font-bold";
                                    else if (u.membership_status === "free") statusColor = "bg-emerald-50 text-emerald-700 border border-emerald-150";

                                    return (
                                        <TableRow key={u.id} className="hover:bg-gray-50/50 transition-colors">
                                            <TableCell className="px-6 py-4 flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-aqua-spring border border-ocean-green/15 flex items-center justify-center text-ocean-green font-bold text-xs">
                                                    {userInitials}
                                                </div>
                                                <span className="font-semibold text-cyprus">{u.full_name}</span>
                                            </TableCell>
                                            <TableCell className="px-6 py-4 text-gray-500">{u.email}</TableCell>
                                            <TableCell className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${roleColor}`}>
                                                    {u.role}
                                                </span>
                                            </TableCell>
                                            <TableCell className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider ${statusColor}`}>
                                                    {u.membership_status}
                                                </span>
                                            </TableCell>
                                            <TableCell className="px-6 py-4 text-center font-bold text-cyprus">
                                                {u.membership_points?.toLocaleString("id-ID") || 0} <span className="text-[10px] text-gray-400 font-medium">pts</span>
                                            </TableCell>
                                            <TableCell className="px-6 py-4 text-gray-400">{formatDate(u.created_at)}</TableCell>
                                            {currentUser?.role === "admin" && (
                                                <TableCell className="px-6 py-4 text-center">
                                                    <div className="inline-flex gap-2">
                                                        <button
                                                            onClick={() => openEditModal(u)}
                                                            className="p-1.5 hover:bg-indigo-50 text-indigo-600 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-indigo-100"
                                                            title="Edit User & CRM"
                                                        >
                                                            <MdEdit className="text-lg" />
                                                        </button>
                                                        {u.id !== currentUser.id && (
                                                            <button
                                                                onClick={() => openDeleteModal(u)}
                                                                className="p-1.5 hover:bg-red-50 text-red-600 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-red-100"
                                                                title="Hapus User"
                                                            >
                                                                <MdDelete className="text-lg" />
                                                            </button>
                                                        )}
                                                    </div>
                                                </TableCell>
                                            )}
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    )}
                </div>
            </div>

            {/* Modal Add User */}
            <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Tambah Anggota Baru ✨">
                <form onSubmit={handleAddUser} className="space-y-4 text-left">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                        <input
                            type="text"
                            value={addForm.fullName}
                            onChange={(e) => setAddForm({ ...addForm, fullName: e.target.value })}
                            className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-ocean-green/20 focus:border-ocean-green"
                            placeholder="Nama Lengkap"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            value={addForm.email}
                            onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                            className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-ocean-green/20 focus:border-ocean-green"
                            placeholder="email@contoh.com"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            value={addForm.password}
                            onChange={(e) => setAddForm({ ...addForm, password: e.target.value })}
                            className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-ocean-green/20 focus:border-ocean-green"
                            placeholder="Minimal 6 karakter"
                            minLength={6}
                            required
                        />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                            <select
                                value={addForm.role}
                                onChange={(e) => setAddForm({ ...addForm, role: e.target.value })}
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-ocean-green/20 focus:border-ocean-green text-gray-700"
                            >
                                <option value="member">Member (Pelanggan)</option>
                                <option value="staff">Staff (Apoteker)</option>
                                <option value="manager">Manager</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status Member</label>
                            <select
                                value={addForm.membershipStatus}
                                onChange={(e) => setAddForm({ ...addForm, membershipStatus: e.target.value })}
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-ocean-green/20 focus:border-ocean-green text-gray-700"
                            >
                                <option value="free">Free</option>
                                <option value="premium">Premium</option>
                                <option value="vip">VIP</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Poin Awal</label>
                            <input
                                type="number"
                                min="0"
                                value={addForm.membershipPoints}
                                onChange={(e) => setAddForm({ ...addForm, membershipPoints: parseInt(e.target.value) || 0 })}
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-ocean-green/20 focus:border-ocean-green"
                                placeholder="0"
                            />
                        </div>
                    </div>
                    <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={() => setIsAddModalOpen(false)}
                            className="px-4 py-2 text-sm font-semibold text-gray-500 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={actionLoading}
                            className="px-5 py-2 text-sm font-semibold text-white bg-ocean-green hover:bg-emerald-700 rounded-xl transition-all shadow-sm cursor-pointer disabled:opacity-50"
                        >
                            {actionLoading ? "Menyimpan..." : "Simpan"}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Modal Edit User & CRM */}
            <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Profil & CRM Keanggotaan 📝">
                <form onSubmit={handleEditUser} className="space-y-4 text-left">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                        <input
                            type="text"
                            value={editForm.fullName}
                            onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                            className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-ocean-green/20 focus:border-ocean-green"
                            placeholder="Nama Lengkap"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                            <select
                                value={editForm.role}
                                onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-ocean-green/20 focus:border-ocean-green text-gray-700"
                            >
                                <option value="member">Member (Pelanggan)</option>
                                <option value="staff">Staff (Apoteker)</option>
                                <option value="manager">Manager</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status Member</label>
                            <select
                                value={editForm.membershipStatus}
                                onChange={(e) => setEditForm({ ...editForm, membershipStatus: e.target.value })}
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-ocean-green/20 focus:border-ocean-green text-gray-700"
                            >
                                <option value="free">Free</option>
                                <option value="premium">Premium</option>
                                <option value="vip">VIP</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Poin CRM</label>
                            <input
                                type="number"
                                min="0"
                                value={editForm.membershipPoints}
                                onChange={(e) => setEditForm({ ...editForm, membershipPoints: parseInt(e.target.value) || 0 })}
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-ocean-green/20 focus:border-ocean-green"
                                placeholder="0"
                            />
                        </div>
                    </div>
                    <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={() => setIsEditModalOpen(false)}
                            className="px-4 py-2 text-sm font-semibold text-gray-500 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={actionLoading}
                            className="px-5 py-2 text-sm font-semibold text-white bg-ocean-green hover:bg-emerald-700 rounded-xl transition-all shadow-sm cursor-pointer disabled:opacity-50"
                        >
                            {actionLoading ? "Memperbarui..." : "Perbarui"}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Modal Delete Confirmation */}
            <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Hapus User ⚠️">
                <div className="space-y-4 text-left">
                    <p className="text-sm text-gray-600">
                        Apakah Anda yakin ingin menghapus user <strong className="text-cyprus">{selectedUser?.full_name}</strong> ({selectedUser?.email})?
                        Tindakan ini akan menghapus profil mereka secara permanen dari database.
                    </p>
                    <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={() => setIsDeleteModalOpen(false)}
                            className="px-4 py-2 text-sm font-semibold text-gray-500 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                        >
                            Batal
                        </button>
                        <button
                            onClick={handleDeleteUser}
                            disabled={actionLoading}
                            className="px-5 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-all shadow-sm cursor-pointer disabled:opacity-50"
                        >
                            {actionLoading ? "Menghapus..." : "Hapus"}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
