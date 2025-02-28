\*Cài đặt Meilisearch:
Trên WLS:
docker run -d --name meilisearch -p 7700:7700 getmeili/meilisearch
Trực tiếp trên Linux:
curl -L https://install.meilisearch.com | Sau khi tải xong, bạn có thể di chuyển file MeiliSearch đến thư mục /usr/local/bin để có thể chạy từ bất kỳ đâu

sudo mv meilisearch /usr/local/bin/
sudo chmod +x /usr/local/bin/meilisearch
Kiểm tra
meilisearch --version
curl -X GET 'http://localhost:7700/health' or curl http://localhost:7700/health

Chạy MeiliSearch như một service
meilisearch --http-addr '0.0.0.0:7700'
Tuy nhiên, để nó tự động chạy khi khởi động hệ thống, hãy tạo một service systemd
Tạo file service:
sudo nano /etc/systemd/system/meilisearch.service
Thêm nội dung sau:

[Unit]
Description=MeiliSearch
After=network.target

[Service]
ExecStart=/usr/local/bin/meilisearch --http-addr '0.0.0.0:7700'
Restart=always
User=root

[Install]
WantedBy=multi-user.target
Lưu lại và chạy lệnh sau để kích hoạt service:

sudo systemctl daemon-reload
sudo systemctl enable meilisearch
sudo systemctl start meilisearch
Kiểm tra xem MeiliSearch có chạy không:

systemctl status meilisearch
Nếu thấy thông báo active (running) là thành công.

Cho phép firewall (nếu cần)
Nếu server có firewall, bạn cần mở cổng 7700:

sudo ufw allow 7700

\*\*\*Về MEILI_API_KEY:

MEILI_API_KEY là một chuỗi ký tự đặc biệt được Meilisearch cung cấp để xác thực và quản lý quyền truy cập vào API của họ. Nó giúp xác định và kiểm soát việc truy cập, đảm bảo rằng chỉ những người hoặc ứng dụng có quyền mới có thể tương tác với dịch vụ Meilisearch. Việc để trống MEILI_API_KEY có thể dẫn đến việc không thể xác thực khi gọi API, do đó bạn nên thiết lập khóa này để bảo mật và quản lý quyền truy cập hiệu quả.

-- Khi cài đặt mặc định, Meilisearch chạy ở chế độ không cần API key (public mode).
Nếu bạn muốn bật bảo mật, bạn cần tạo API key theo hướng dẫn tại đây.
Bạn có thể lấy API key bằng lệnh:

curl -X GET 'http://localhost:7700/keys'

- Lệnh tạo API key

curl -X POST 'http://localhost:7700/keys' \
-H 'Content-Type: application/json' \
--data '{
"description": "Master Key",
"actions": ["*"],
"indexes": ["*"],
"expiresAt": null
}'

đặt API_KEY vào env: MEILI_API_KEY=your_generated_key

ref: https://chatgpt.com/share/67bfdcea-9da0-8004-a458-bc0e315062c0
