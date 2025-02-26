# README - Elasticsearch & Prisma in NestJS

## 1. **Các lệnh cơ bản trong Kibana**

### **1.1. Kiểm tra danh sách index**

```json
GET _cat/indices?v
```

### **1.2. Xem thông tin của một index cụ thể**

```json
GET messages
```

### **1.3. Tạo index mới với cấu trúc mapping**

```json
PUT messages
{
  "settings": {
    "analysis": {
      "analyzer": {
        "custom_analyzer": {
          "type": "standard",
          "stopwords": "_english_"
        }
      }
    }
  },
  "mappings": {
    "properties": {
      "message": {
        "type": "text",
        "analyzer": "custom_analyzer"
      },
      "timestamp": {
        "type": "date"
      }
    }
  }
}
```

### **1.4. Xóa một index**

```json
DELETE messages
```

### **1.5. Thêm dữ liệu vào index**

```json
POST messages/_doc/1
{
  "message": "Hello Elasticsearch",
  "timestamp": "2025-02-26T10:00:00"
}
```

### **1.6. Tìm kiếm full-text với Fuzzy Search**

```json
GET messages/_search
{
  "query": {
    "match": {
      "message": {
        "query": "Helo",
        "fuzziness": "AUTO"
      }
    }
  }
}
```

---

## 2. **Tương tác với Prisma trong NestJS**

### **2.1. Cài đặt Prisma**

```sh
npm install @prisma/client
```

### **2.2. Khởi tạo Prisma**

```sh
npx prisma init
```

### **2.3. Định nghĩa model trong `prisma/schema.prisma`**

```prisma
model User {
  id    String @id @default(uuid())
  name  String
  email String @unique
}
```

### **2.4. Chạy migration để cập nhật database**

```sh
npx prisma migrate dev --name init
```

### **2.5. Tạo service Prisma trong NestJS**

```typescript
@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    super();
  }
}
```

### **2.6. Sử dụng Prisma trong Service**

```typescript
@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(name: string, email: string) {
    return await this.prisma.user.create({
      data: { name, email },
    });
  }

  async getAllUsers() {
    return await this.prisma.user.findMany();
  }
}
```

### **2.7. Chạy Prisma Studio để quản lý dữ liệu**

```sh
npx prisma studio
```

---

## 3. **Kết luận**

🚀 Happy Coding!
