SNAPBOOK — PROJECT ROADMAP & DOCUMENTATION
1. TỔNG QUAN DỰ ÁN
SnapBook là nền tảng mobile kết nối Studio/Photographer với Customer muốn đặt lịch chụp ảnh, hoạt động theo mô hình marketplace với cơ chế bảo vệ cả 2 bên.

2. TECH STACK
LayerTechMobileReact Native + Expo (Expo Go — dev only)StateRedux ToolkitAPI ClientAxios + JWT interceptor (AsyncStorage)BackendNode.js + Express (Modular Monolith)AuthJWT (access token 15p + refresh token 7 ngày)RealtimeSocket.io (chat)DatabaseMongoDB AtlasImagesCloudinary (private URL + watermark preview)PaymentVNPayBackground Jobsnode-cronDeployRailway/Render (backend), Expo Go (mobile dev)

3. KIẾN TRÚC HỆ THỐNG — Modular Monolith
CLIENT LAYER
├── React Native App (1 app — 3 roles)
├── RootNavigator (role-based: Customer/Studio/Admin)
├── Redux Toolkit (auth, booking, notification, chat)
├── Axios Instance (baseURL + JWT interceptor)
├── Socket.io Client (chat realtime)
└── AsyncStorage (token storage)

SERVER LAYER — Modular Monolith
├── Express App (app.ts)
├── JWT Middleware → Role Middleware
├── «Modules» Boundary
│   ├── «AuthModule»       Controller + Service + Model
│   ├── «UserModule»       Controller + Service + Model
│   ├── «KycModule»        Controller + Service + Model
│   ├── «ProfileModule»    Controller + Service + Model
│   ├── «BookingModule»    Controller + Service + Model
│   ├── «ScheduleModule»   Controller + Service + Model
│   ├── «PaymentModule»    Controller + Service + Model
│   ├── «DeliveryModule»   Controller + Service + Model
│   ├── «ReviewModule»     Controller + Service + Model
│   ├── «ChatModule»       Controller + Service + Model
│   ├── «VoucherModule»    Controller + Service + Model
│   ├── «WalletModule»     Controller + Service + Model
│   └── «NotificationModule» Controller + Service + Model
├── «Shared» Services
│   ├── Cloudinary Service
│   ├── VNPay Service
│   └── Socket.io Server
└── Cron Jobs
    ├── autoRejectBooking (every 5min)
    ├── autoReleasePayment (daily)
    └── expireVoucher (daily)

EXTERNAL SERVICES
├── MongoDB Atlas
├── Cloudinary (images + watermark)
├── VNPay (payment gateway)
└── AI Service (review filter)

4. CẤU TRÚC THƯ MỤC
Backend
backend/
├── src/
│   ├── modules/
│   │   ├── auth/         auth.controller.ts, auth.service.ts, auth.routes.ts, auth.validator.ts
│   │   ├── user/
│   │   ├── kyc/
│   │   ├── profile/
│   │   ├── booking/
│   │   ├── schedule/
│   │   ├── payment/
│   │   ├── delivery/
│   │   ├── review/
│   │   ├── chat/
│   │   ├── voucher/
│   │   ├── wallet/
│   │   └── notification/
│   ├── models/           17 MongoDB collections
│   ├── middlewares/      auth, role, upload, error
│   ├── shared/           cloudinary.ts, vnpay.ts, socket.ts
│   ├── crons/            autoRejectBooking, autoReleasePayment, expireVoucher
│   ├── config/           db.ts, env.ts
│   └── app.ts
└── server.ts
Frontend
frontend/
├── src/
│   ├── api/              axiosInstance.ts + 13 api files
│   ├── screens/
│   │   ├── shared/       Login, Register, Chat, Notification
│   │   ├── customer/     Home, Search, Booking, Payment, Review...
│   │   ├── studio/       Dashboard, Booking, Schedule, Upload, Wallet...
│   │   └── admin/        KYC, Reports, Users
│   ├── navigation/       Root, Auth, Customer, Studio, Admin Navigator
│   ├── redux/slices/     auth, booking, notification, chat
│   ├── components/       common/, customer/, studio/, admin/
│   ├── hooks/            useAuth, useSocket, useNotification
│   ├── services/         socket.service.ts
│   ├── types/
│   └── utils/            token, format, validate
└── App.tsx

5. DATABASE — 17 COLLECTIONS
users           email, password, role, kycStatus, isActive
profiles        userId(ref), avatar, packages(embed), avgRating
kyc             userId(ref), idDocURL, selfieURL, portfolioURLs(embed), status
notifications   userId(ref), type, title, body, isRead
bookings        customerId(ref), studioId(ref), voucherId(ref), date, status, deposit
schedules       studioId(ref), weeklyTemplate(embed), markedDates(embed)
slots           scheduleId(ref), studioId(ref), date, status
transactions    bookingId(ref), userId(ref), amount, type, status
wallets         studioId(ref), totalRevenue, holdingBalance, availableBalance
withdrawals     studioId(ref), walletId(ref), amount, destinationType, status
deliveries      bookingId(ref), studioId(ref), customerId(ref), status, holdUntil
photo_assets    deliveryId(ref), privateURL, previewURL
reviews         bookingId(ref), customerId(ref), studioId(ref), rating, status
reports         reviewId(ref), reportedBy(ref), reason, status
conversations   participants(ref), bookingId(ref), lastMessageAt
messages        conversationId(ref), senderId(ref), text
vouchers        studioId(ref), code, type, value, validFrom, validTo, status

6. BUSINESS LOGIC CỐT LÕI
Payment Flow (30/70 model)
Customer đặt lịch → pay 30% deposit qua VNPay → hold
        ↓
Studio approve → lock slot + giữ 30% held balance
        ↓
Studio upload ảnh → Cloudinary tạo watermark preview
        ↓
Customer xem watermark → pay 70% → unlock full resolution
        ↓
3 ngày không dispute → auto release 30%+70% → studio wallet
Auto-Reject (24h Cron)
Booking Pending > 24h → auto reject
→ Refund 100% Customer + record penalty Studio
Conflict Schedule
Studio mark unavailable + có booking Confirmed
→ Block save + hiện "Chat with Customer" button
→ Bắt buộc mở chat trước
→ Sau chat → unlock nút Cancel
→ Studio cancel (lý do hợp lệ) → refund 100%
→ Customer cancel (không lý do) → mất cọc 30%
Review + AI Filter
Customer submit review
→ AI filter → pass: Published / fail: Flagged → notify Admin
→ Studio reply (max 500 chars, 1 reply/review)
→ Studio report → Admin: Hide (recalculate rating) / Dismiss

7. PHÂN CÔNG CÔNG VIỆC
NgườiUC phụ tráchMô tảÂnUC-01~05, UC-27~38Auth + toàn bộ StudioKim AnhUC-06~21, UC-26Customer Booking + Payment + ReviewĐạtUC-22~25, UC-39~51Customer Chat + Register + Admin

8. DANH SÁCH 51 USE CASES
Must Have (31 UC)
UCTênNgườiUC-01LoginÂnUC-02Login with GoogleÂnUC-03LogoutÂnUC-04Forgot PasswordÂnUC-05Edit ProfileÂnUC-07Explore & Search StudioKim AnhUC-08View PortfolioKim AnhUC-09View Studio Profile DetailsKim AnhUC-11Book Shooting SessionKim AnhUC-13Payment DepositKim AnhUC-14View Booking ListKim AnhUC-15Track Booking StatusKim AnhUC-16View Booking Details (Customer)Kim AnhUC-18View & Download PhotosKim AnhUC-22Chat with StudioĐạtUC-23View Chat ListĐạtUC-24Register to Studio/PhotographerĐạtUC-25Submit Verification DocumentsĐạtUC-27Create Portfolio & KYCÂnUC-28Setup ProfileÂnUC-30Update Availability ScheduleÂnUC-31View List Booking RequestÂnUC-32Handle Booking RequestÂnUC-33Upload Delivered PhotosÂnUC-34Track Revenue & Request WithdrawalÂnUC-36Chat With CustomerÂnUC-38View Booking Details (Studio)ÂnUC-39View User ListĐạtUC-40Suspend / Activate AccountĐạtUC-41Verify Register StudioĐạtUC-45View Dashboard (Admin)Đạt
Should Have (13 UC)
UCTênNgườiUC-06Change PasswordKim AnhUC-17Request Reschedule or CancelKim AnhUC-19Review & RatingKim AnhUC-20Rate Studio (1–5 Stars)Kim AnhUC-26View NotificationsKim AnhUC-29Create VouchersÂnUC-35Review & Reply to Customer FeedbackÂnUC-42Review PortfolioĐạtUC-43Moderate ContentĐạtUC-44Review ProfileĐạtUC-46View Financial ReportsĐạtUC-50Set Commission RateĐạtUC-51Manage PoliciesĐạt
Could Have (7 UC)
UCTênNgườiUC-10Save to WishlistKim AnhUC-12Apply VoucherKim AnhUC-21Write Review with PhotosKim AnhUC-37View Analytics & PerformanceÂnUC-47Withdraw Funds (Admin)ĐạtUC-48Export Audit DataĐạtUC-49Send Bulk NotificationsĐạt

9. TÀI LIỆU ĐÃ HOÀN THÀNH
Loại tài liệuTrạng tháiUse Case Specification (51 UC)✅Activity Diagrams✅Sequence Diagrams (PlantUML)✅ Đang sửa → Modular MonolithCommunication Diagrams (Draw.io)✅ Đang sửa → Modular MonolithState Diagrams (PlantUML)✅Class Diagrams (PlantUML + Draw.io)✅Database Design ERD (PlantUML + Draw.io)✅System Architecture (Draw.io)✅ Modular MonolithPhân công công việc (Excel)✅MoSCoW Priority (Excel)✅Folder Structure (ZIP)✅Project pushed to GitHub✅

10. CÔNG VIỆC TIẾP THEO
Đang làm

✏️ Sửa Sequence Diagrams → Modular Monolith convention
✏️ Sửa Communication Diagrams → Modular Monolith convention

Sắp làm

🔲 Bắt đầu code Backend — theo thứ tự Must Have
🔲 Setup shared infrastructure (Cloudinary, VNPay, Socket.io)
🔲 Code từng module theo phân công
🔲 Bắt đầu code Frontend — screens + navigation
🔲 Integration testing

Thứ tự code đề xuất (Backend)
1. auth module         → login, register, JWT
2. user module         → profile, KYC
3. booking module      → create, approve, reject, auto-reject
4. schedule module     → availability, conflict detection
5. payment module      → VNPay deposit, refund
6. delivery module     → upload, watermark, 70% payment
7. wallet module       → revenue, withdrawal
8. chat module         → Socket.io realtime
9. review module       → AI filter, reply, report
10. notification module → push notification
11. voucher module     → create, validate, apply
12. analytics module   → aggregate queries

11. API CONVENTIONS
Auth:      POST /api/auth/login, /register, /refresh-token
KYC:       POST /api/kyc, PATCH /api/admin/kyc/{id}/approve|reject
Profile:   GET/PATCH /api/profile/me
Booking:   POST /api/bookings
           PATCH /api/bookings/{id}/approve|reject|cancel|deliver
Payment:   POST /api/bookings/{id}/pay-remaining
Schedule:  GET/PATCH /api/schedule/me
Wallet:    GET /api/wallet/summary, POST /api/wallet/withdraw
Analytics: GET /api/analytics?range=7d|30d|90d
Chat:      POST /api/chat/open, GET /api/conversations
Review:    POST /api/reviews, POST /api/reviews/{id}/reply|report
Admin:     GET /api/admin/users, PATCH /api/admin/users/{id}/suspend

12. GIT WORKFLOW
Branch:   feature/an-studio
          feature/kimanh-customer
          feature/dat-admin

Commit:   feat(UC-xx): mô tả
          fix(UC-xx): mô tả

Flow:     feature branch → PR → review → merge main
          git pull origin main (mỗi ngày trước khi code)2 / 2