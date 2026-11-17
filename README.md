# SMART OFFICE – Mã nguồn React Native (Lab 3)

**Ứng dụng di động** cho đồ án Lập trình di động 2. Chưa bao gồm firmware ESP32 và cấu hình Broker (Lab 1, Lab 2).

## 1. Chức năng

- Dashboard: nhiet do, do am, chuyen dong, trang thai ESP32.
- Dieu khien den va quat. Giao dien chi doi trang thai that khi ESP32 phan hoi topic `state`.
- Nhat ky su kien, loi va hanh dong trong phien su dung.
- Chuyen che do **Mo phong** (chay khong can Broker) / **MQTT that**.
- MQTT.js qua WebSocket; subscribe, publish QoS 1, tu ket noi lai khi mat mang.
- Dung MQTT khi app ve background, ket noi lai khi foreground.
- Kiem tra payload JSON, gioi han du lieu nhiet do/do am.

## 2. Khởi tạo trên Windows (PowerShell)

Can cai Node.js LTS, VS Code va Expo Go tren Android.

```powershell
cd D:\
npx create-expo-app@latest smart-office-app --template blank
cd smart-office-app
npx expo install react-native-safe-area-context expo-status-bar @expo/vector-icons react-native-url-polyfill
npm install mqtt
```

Giai nen file zip source code. **Chep `App.js` va thu muc `src`** vao `D:\smart-office-app`, ghi de `App.js` mac dinh do Expo tao. Khong chep de `package.json` va `app.json` cua Expo.

```powershell
npx expo start -c
```

Tren Android: mo **Expo Go** -> Scan QR. May tinh va dien thoai nen cung Wi-Fi; neu khong mo duoc, thu `npx expo start --tunnel`.

**Luu y:** source code duoc kiem tra tinh hop le cu phap va test bo tach du lieu; chua chay Expo end-to-end trong moi truong tao file vi khong truy cap duoc npm registry.

## 3. Kiểm thử ngay khi CHƯA CÓ Broker

1. Mo app, che do mac dinh la **Mo phong**.
2. Xem nhiet do / do am thay doi moi 4 giay.
3. Bat/tat Den/Quat; app cap nhat giao dien va nhat ky.
4. Chuyen cac tab: Tong quan / Thiet bi / Nhat ky / Cai dat.

## 4. Kết nối MQTT khi đã có Broker

1. Mo **Cai dat** -> **MQTT that**.
2. Nhap broker URL **WebSocket**, vi du `ws://192.168.1.100:9001` (IP la minh hoa, thay bang IP may chay Broker).
3. Nhap Username va Password neu Broker bat xac thuc.
4. Nhan **Ket noi MQTT Broker**.
5. Khi ESP32 publish du lieu, app hien thi nhiet do va do am.

**Quan trong:** `mqtt://...:1883` KHONG phai la URL dung cho app React Native nay. Broker phai bat WebSocket listener, vi du Mosquitto `listener 9001` va `protocol websockets`. Tren Android emulator co the dung IP cua host `10.0.2.2` neu Broker dang chay tren may tinh. Tren dien thoai that, dung LAN IP cua may tinh; `localhost` se tro toi chinh dien thoai, khong phai PC.

Ket noi Internet: uu tien `wss://` (TLS + chung chi hop le) va MQTT username/ACL.

## 5. Topic chung cho cả 3 Lab

| Topic | Publish boi | Payload vi du |
|---|---|---|
| `smartoffice/room1/telemetry` | ESP32 | `{"temperature":27.4,"humidity":62,"motion":true}` |
| `smartoffice/room1/cmd/light` | App | `{"on":true}` |
| `smartoffice/room1/cmd/fan` | App | `{"on":false}` |
| `smartoffice/room1/state/light` | ESP32 | `{"on":true}` |
| `smartoffice/room1/state/fan` | ESP32 | `{"on":false}` |
| `smartoffice/room1/status` | ESP32 | `online` / `offline` |

De app hien thi trang thai that ngay sau khi ket noi, firmware nen publish state voi `retain: true`, va status nen duoc cau hinh MQTT Last Will.

## 6. Cấu trúc

```text
App.js
src/
  components/OfficeUI.js
  config/topics.js
  hooks/useSmartOffice.js
  screens/DashboardScreen.js
  screens/DevicesScreen.js
  screens/ActivityScreen.js
  screens/SettingsScreen.js
  services/mqttService.js
  utils/parsers.js
  theme.js
tests/parsers.test.mjs
```

## 7. Các bằng chứng cần chụp để nộp

- Dashboard chay mo phong; 2 cong tac den/quat thay doi.
- Man hinh Cai dat MQTT va trang thai ket noi.
- Broker log thay subscribe/publish; ESP32 nhan lenh.
- Nhat ky khi cat ket noi va khi ket noi lai.
- Payload sai bi loai bo (kiem tra du lieu dau vao).

**Gioi han:** Chua co firmware/Relay hay Broker; mo phong khong chung minh da dieu khien thiet bi that. MQTT trong app foreground khong thay the push notification khi app da dong.
