import { useCallback, useEffect, useMemo, useState } from "react";
import { CheckCircle2, Coins, Edit, EyeOff, Heart, Loader2, Palette, Plus, Search, ShoppingBag, Sparkles, Trash2, UserRound, Zap } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import api from "@/services/api";

const itemTypes = [
  { value: "AVATAR", label: "Avatar", icon: UserRound },
  { value: "DECORATION", label: "Trang trí", icon: Palette },
  { value: "LIFE", label: "Mạng", icon: Heart },
];

const emptyForm = {
  name: "",
  description: "",
  type: "AVATAR",
  price: 0,
  assetUrl: "",
  accentColor: "#2563eb",
  active: true,
};

const getTypeMeta = (type) => itemTypes.find((item) => item.value === type) || itemTypes[0];

const getPreviewIcon = (item) => {
  if (item.assetUrl === "zap") return Zap;
  if (item.type === "LIFE") return Heart;
  if (item.type === "DECORATION") return Sparkles;
  return UserRound;
};

const ShopItemManagement = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/admin/shop-items");
      setItems(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Cannot load shop items:", error);
      toast.error("Không thể tải danh sách vật phẩm.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const filteredItems = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    return items
      .filter((item) => typeFilter === "all" || item.type === typeFilter)
      .filter((item) => statusFilter === "all" || String(Boolean(item.active)) === statusFilter)
      .filter((item) => {
        if (!keyword) return true;
        return `${item.name || ""} ${item.description || ""}`.toLowerCase().includes(keyword);
      });
  }, [items, searchTerm, statusFilter, typeFilter]);

  const stats = useMemo(() => ({
    total: items.length,
    active: items.filter((item) => item.active).length,
    hidden: items.filter((item) => !item.active).length,
  }), [items]);

  const openCreateDialog = () => {
    setEditingItem(null);
    setFormData(emptyForm);
    setIsDialogOpen(true);
  };

  const openEditDialog = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name || "",
      description: item.description || "",
      type: item.type || "AVATAR",
      price: Number(item.price) || 0,
      assetUrl: item.assetUrl || "",
      accentColor: item.accentColor || "#2563eb",
      active: Boolean(item.active),
    });
    setIsDialogOpen(true);
  };

  const updateForm = (field, value) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error("Vui lòng nhập tên vật phẩm.");
      return;
    }

    setSaving(true);
    const payload = {
      ...formData,
      name: formData.name.trim(),
      description: formData.description.trim(),
      price: Math.max(Number(formData.price) || 0, 0),
    };

    try {
      if (editingItem) {
        await api.put(`/api/admin/shop-items/${editingItem.id}`, payload);
        toast.success("Đã cập nhật vật phẩm.");
      } else {
        await api.post("/api/admin/shop-items", payload);
        toast.success("Đã thêm vật phẩm mới.");
      }
      setIsDialogOpen(false);
      await fetchItems();
    } catch (error) {
      toast.error(error.response?.data?.message || "Không thể lưu vật phẩm.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeactivate = async (item) => {
    if (!window.confirm(`Ẩn vật phẩm "${item.name}" khỏi shop học sinh?`)) return;

    try {
      await api.delete(`/api/admin/shop-items/${item.id}`);
      toast.success("Đã ẩn vật phẩm khỏi shop.");
      await fetchItems();
    } catch (error) {
      toast.error(error.response?.data?.message || "Không thể ẩn vật phẩm.");
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-2xl font-bold text-slate-900">
            <ShoppingBag className="h-6 w-6 text-blue-600" />
            Quản lý vật phẩm
          </h2>
          <p className="mt-1 text-sm text-slate-500">Tạo và điều chỉnh catalog avatar, trang trí, mạng trong shop học sinh.</p>
        </div>
        <Button onClick={openCreateDialog} className="bg-blue-600 text-white hover:bg-blue-700">
          <Plus className="h-4 w-4" /> Thêm vật phẩm
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard icon={ShoppingBag} label="Tổng vật phẩm" value={stats.total} className="bg-blue-50 text-blue-600" />
        <StatCard icon={CheckCircle2} label="Đang bán" value={stats.active} className="bg-emerald-50 text-emerald-600" />
        <StatCard icon={EyeOff} label="Đang ẩn" value={stats.hidden} className="bg-slate-100 text-slate-600" />
      </div>

      <Card className="border-none shadow-sm">
        <CardContent className="flex flex-col gap-4 p-4 lg:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              className="w-full rounded-md border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm outline-none transition-all focus:ring-2 focus:ring-blue-500"
              placeholder="Tìm theo tên hoặc mô tả vật phẩm..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3 sm:flex">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full bg-white sm:w-[150px]">
                <SelectValue placeholder="Loại" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả loại</SelectItem>
                {itemTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full bg-white sm:w-[150px]">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="true">Đang bán</SelectItem>
                <SelectItem value="false">Đang ẩn</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden border-none shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-6 py-4 font-medium">Vật phẩm</th>
                <th className="px-6 py-4 font-medium">Loại</th>
                <th className="px-6 py-4 font-medium text-center">Giá</th>
                <th className="px-6 py-4 font-medium text-center">Trạng thái</th>
                <th className="px-6 py-4 font-medium text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-slate-500">
                    <Loader2 className="mr-2 inline h-4 w-4 animate-spin" /> Đang tải vật phẩm...
                  </td>
                </tr>
              ) : filteredItems.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-slate-500">Không có vật phẩm phù hợp.</td>
                </tr>
              ) : filteredItems.map((item) => {
                const meta = getTypeMeta(item.type);
                const Icon = getPreviewIcon(item);
                const TypeIcon = meta.icon;
                return (
                  <tr key={item.id} className="group transition-colors hover:bg-slate-50/80">
                    <td className="min-w-[300px] px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md border border-slate-100 bg-white"
                          style={{ color: item.accentColor || "#0f172a", backgroundColor: item.accentColor ? `${item.accentColor}14` : "#ffffff" }}
                        >
                          {item.type === "AVATAR" && item.assetUrl ? (
                            <img src={item.assetUrl} alt={item.name} className="h-10 w-10 rounded-full object-cover" />
                          ) : (
                            <Icon className="h-5 w-5" />
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">{item.name}</div>
                          <div className="line-clamp-1 text-xs text-slate-500">{item.description || "Không có mô tả"}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className="gap-1 bg-white">
                        <TypeIcon className="h-3.5 w-3.5" /> {meta.label}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center gap-1 font-bold text-amber-700">
                        <Coins className="h-4 w-4" /> {item.price}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {item.active ? (
                        <Badge className="bg-emerald-600 hover:bg-emerald-600">Đang bán</Badge>
                      ) : (
                        <Badge variant="secondary">Đang ẩn</Badge>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:bg-blue-50" onClick={() => openEditDialog(item)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:bg-red-50" onClick={() => handleDeactivate(item)} disabled={!item.active}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingItem ? "Chỉnh sửa vật phẩm" : "Thêm vật phẩm"}</DialogTitle>
            <DialogDescription>Thông tin này sẽ hiển thị trong shop của học sinh khi vật phẩm đang bán.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="name">Tên vật phẩm</Label>
              <Input id="name" value={formData.name} onChange={(event) => updateForm("name", event.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Mô tả</Label>
              <Textarea id="description" value={formData.description} onChange={(event) => updateForm("description", event.target.value)} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label>Loại</Label>
                <Select value={formData.type} onValueChange={(value) => updateForm("type", value)}>
                  <SelectTrigger className="bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {itemTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="price">Giá xu</Label>
                <Input id="price" type="number" min="0" value={formData.price} onChange={(event) => updateForm("price", event.target.value)} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="assetUrl">Asset URL hoặc mã icon</Label>
              <Input id="assetUrl" value={formData.assetUrl} onChange={(event) => updateForm("assetUrl", event.target.value)} placeholder="https://... hoặc heart/zap" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="accentColor">Màu nhấn</Label>
                <Input id="accentColor" type="color" value={formData.accentColor || "#2563eb"} onChange={(event) => updateForm("accentColor", event.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label>Trạng thái</Label>
                <Select value={String(formData.active)} onValueChange={(value) => updateForm("active", value === "true")}>
                  <SelectTrigger className="bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Đang bán</SelectItem>
                    <SelectItem value="false">Đang ẩn</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Hủy</Button>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {editingItem ? "Lưu thay đổi" : "Thêm vật phẩm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, className }) => (
  <Card className="border-none shadow-sm">
    <CardContent className="flex items-center gap-3 p-4">
      <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${className}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-xs text-slate-500">{label}</p>
        <p className="text-xl font-bold text-slate-900">{value}</p>
      </div>
    </CardContent>
  </Card>
);

export default ShopItemManagement;
