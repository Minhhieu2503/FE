# SnapBook

## Luu y khi chay du an

### 1. Cau truc
- `backend/`: Node.js + Express + MongoDB.
- `frontend/`: Expo React Native.

### 2. Chay backend
1. Mo terminal tai `backend/`.
2. Cai package: `npm install`
3. Chay server: `npm run dev`
4. Kiem tra nhanh: mo `http://localhost:8080/`
	 - Ky vong: `SnapBook API is running!`

Luu y:
- Neu bao loi `EADDRINUSE: 8080`, nghia la cong da duoc dung boi process khac.
- Neu backend khong len duoc, frontend login/register se fail.

### 3. Chay frontend
1. Mo terminal tai `frontend/`.
2. Cai package: `npm install`
3. Tao/sua file `.env`:

```env
EXPO_PUBLIC_API_BASE_URL=http://<LAN_IP_CUA_MAY>:8080
```

Vi du: `EXPO_PUBLIC_API_BASE_URL=http://192.168.110.2:8080`

4. Chay Expo: `npx expo start -c`

Luu y quan trong:
- Khi test tren dien thoai that, KHONG dung `localhost` trong `.env`.
- Dien thoai va may tinh phai cung mang Wi-Fi.
- Moi lan sua `.env`, can restart Expo voi `-c`.

### 4. Auth hien tai
- Da ho tro:
	- Register (`/auth/register`)
	- Login (`/auth/login`)
	- Logout local (va goi `/auth/logout` neu backend co)
- Sau khi register thanh cong, app tu dong login va vao Home.
- Register co them `Confirm Password` + show/hide password.

### 5. Loi thuong gap

`Login Failed: Khong ket noi duoc backend`
- Kiem tra backend co chay khong (`http://localhost:8080/`).
- Kiem tra `.env` co dung LAN IP khong.
- Kiem tra firewall neu dien thoai khong goi duoc IP may tinh.

`Login Failed: Invalid email or password`
- Tai khoan chua duoc tao hoac go sai mat khau.
- Tao tai khoan moi bang man Register roi login lai.

`Native module is null, cannot access legacy storage`
- Dong Expo Go, mo lai app, chay `npx expo start -c`.
- Neu van loi, go va cai lai Expo Go tren dien thoai.

### 6. Lenh nhanh
- Backend: `cd backend && npm run dev`
- Frontend: `cd frontend && npx expo start -c`