import { mockAuthUsers } from "@/data/mockAuthUsers";

export const mockLoginApi = ({ email, matkhau }) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const foundUser = mockAuthUsers.find(
                (user) =>
                    user.email.toLowerCase() === email.trim().toLowerCase() &&
                    user.matkhau === matkhau
            );

            if (!foundUser) {
                reject(new Error("Sai email hoặc mật khẩu"));
                return;
            }

            if (foundUser.khoa === "khoa") {
                reject(new Error("Tài khoản đã bị khóa"));
                return;
            }

            resolve({
                token: `mock-token-${foundUser.user_id}`,
                user: {
                    id: foundUser.user_id,
                    hoten: foundUser.hoten,
                    email: foundUser.email,
                    vaitro: foundUser.vaitro,
                    tentk: foundUser.tentk,
                },
            });
        }, 500);
    });
};