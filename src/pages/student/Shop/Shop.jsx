import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Coins, Heart, Loader2, Palette, ShoppingBag, Sparkles, UserRound, Zap } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import api from "@/services/api";
import { useAuth } from "@/context/AuthContext";

const typeMeta = {
  ALL: { label: "Tất cả", icon: ShoppingBag },
  AVATAR: { label: "Avatar", icon: UserRound },
  DECORATION: { label: "Trang trí", icon: Palette },
  LIFE: { label: "Mạng", icon: Heart },
};

const typeOrder = ["ALL", "AVATAR", "DECORATION", "LIFE"];

const getItemIcon = (item) => {
  if (item.assetUrl === "zap") return Zap;
  if (item.type === "LIFE") return Heart;
  if (item.type === "DECORATION") return Sparkles;
  return UserRound;
};

const Shop = () => {
  const { fetchProfile } = useAuth();
  const [shop, setShop] = useState({ coinBalance: 0, items: [] });
  const [loading, setLoading] = useState(true);
  const [busyItemId, setBusyItemId] = useState(null);
  const [selectedType, setSelectedType] = useState("ALL");

  const loadShop = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/shop/me");
      setShop({
        coinBalance: Number(response.data?.coinBalance) || 0,
        items: Array.isArray(response.data?.items) ? response.data.items : [],
      });
    } catch (error) {
      console.error("Không thể tải shop:", error);
      toast.error("Không thể tải shop. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadShop();
  }, []);

  const filteredItems = useMemo(() => {
    if (selectedType === "ALL") return shop.items;
    return shop.items.filter((item) => item.type === selectedType);
  }, [selectedType, shop.items]);

  const ownedCount = shop.items.filter((item) => item.owned).length;

  const handlePurchase = async (item) => {
    setBusyItemId(item.id);
    try {
      const response = await api.post(`/api/shop/items/${item.id}/purchase`);
      toast.success(`Đã mua ${response.data?.item?.name || item.name}.`);
      await loadShop();
      await fetchProfile();
    } catch (error) {
      toast.error(error.response?.data?.message || "Không thể mua vật phẩm này.");
    } finally {
      setBusyItemId(null);
    }
  };

  const handleEquip = async (item) => {
    setBusyItemId(item.id);
    try {
      const response = await api.post(`/api/shop/items/${item.id}/equip`);
      toast.success(`Đã trang bị ${response.data?.item?.name || item.name}.`);
      await loadShop();
      await fetchProfile();
    } catch (error) {
      toast.error(error.response?.data?.message || "Không thể trang bị vật phẩm này.");
    } finally {
      setBusyItemId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 md:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <section className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-950 md:text-3xl">Shop vật phẩm</h1>
            <p className="mt-1 text-sm text-slate-500">Dùng xu học tập để đổi avatar, khung trang trí và biểu tượng mạng.</p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:flex sm:items-center">
            <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Coins className="h-4 w-4" /> Số dư
              </div>
              <p className="mt-1 text-2xl font-bold">{shop.coinBalance}</p>
            </div>
            <div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-800">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <CheckCircle2 className="h-4 w-4" /> Đã sở hữu
              </div>
              <p className="mt-1 text-2xl font-bold">{ownedCount}</p>
            </div>
          </div>
        </section>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {typeOrder.map((type) => {
            const meta = typeMeta[type];
            const Icon = meta.icon;
            const isActive = selectedType === type;
            return (
              <Button
                key={type}
                type="button"
                variant={isActive ? "default" : "outline"}
                className={isActive ? "bg-slate-900 hover:bg-slate-800" : "bg-white"}
                onClick={() => setSelectedType(type)}
              >
                <Icon className="h-4 w-4" />
                {meta.label}
              </Button>
            );
          })}
        </div>

        {loading ? (
          <div className="flex min-h-64 items-center justify-center rounded-lg border bg-white text-slate-500">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Đang tải shop...
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item) => {
              const Icon = getItemIcon(item);
              const isBusy = busyItemId === item.id;
              const canBuy = shop.coinBalance >= item.price;
              return (
                <Card key={item.id} className="overflow-hidden border-slate-200 bg-white shadow-sm">
                  <CardContent className="p-0">
                    <div
                      className="flex h-36 items-center justify-center border-b border-slate-100"
                      style={{ backgroundColor: item.accentColor ? `${item.accentColor}18` : "#f8fafc" }}
                    >
                      {item.type === "AVATAR" && item.assetUrl ? (
                        <img src={item.assetUrl} alt={item.name} className="h-24 w-24 rounded-full bg-white object-cover shadow-sm" />
                      ) : (
                        <div
                          className="flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-sm"
                          style={{ color: item.accentColor || "#0f172a" }}
                        >
                          <Icon className="h-9 w-9" />
                        </div>
                      )}
                    </div>
                    <div className="space-y-4 p-5">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h2 className="text-base font-bold text-slate-950">{item.name}</h2>
                            <p className="mt-1 line-clamp-2 min-h-10 text-sm text-slate-500">{item.description}</p>
                          </div>
                          {item.equipped ? (
                            <Badge className="bg-emerald-600 hover:bg-emerald-600">Đang dùng</Badge>
                          ) : item.owned ? (
                            <Badge variant="secondary">Đã mua</Badge>
                          ) : null}
                        </div>
                        <div className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-2">
                          <span className="text-xs font-semibold uppercase text-slate-500">Giá</span>
                          <span className="inline-flex items-center gap-1 text-sm font-bold text-amber-700">
                            <Coins className="h-4 w-4" /> {item.price}
                          </span>
                        </div>
                      </div>

                      {item.owned ? (
                        <Button
                          type="button"
                          className="w-full"
                          variant={item.equipped ? "secondary" : "default"}
                          disabled={item.equipped || isBusy}
                          onClick={() => handleEquip(item)}
                        >
                          {isBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                          {item.equipped ? "Đang trang bị" : "Trang bị"}
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          className="w-full bg-blue-600 hover:bg-blue-700"
                          disabled={!canBuy || isBusy}
                          onClick={() => handlePurchase(item)}
                        >
                          {isBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShoppingBag className="h-4 w-4" />}
                          {canBuy ? "Mua ngay" : "Chưa đủ xu"}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;
