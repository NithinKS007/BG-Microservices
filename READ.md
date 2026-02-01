## 🛠 gRPC Setup & Generation

This project uses **Buf** for type-safe gRPC communication between microservices.

### 📁 Folder Structure
- `utils/src/grpc/protos`: Raw `.proto` definitions.
- `utils/src/grpc/generated`: Auto-generated TypeScript types.

### 🚀 How to Generate Code
If you modify or add a `.proto` file, run the following command from the project root:

```powershell
cd utils/src/grpc
npx @bufbuild/buf generate --template buf.gen.yaml