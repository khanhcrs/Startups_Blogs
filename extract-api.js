const fs = require('fs');
const path = require('path');

function getFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const stat = fs.statSync(path.join(dir, file));
    if (stat.isDirectory()) {
      getFiles(path.join(dir, file), fileList);
    } else if (file.endsWith('.controller.ts')) {
      fileList.push(path.join(dir, file));
    }
  }
  return fileList;
}

const files = getFiles(path.join(__dirname, 'backend/src'));
const apiDocs = [];

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  const moduleName = path.basename(file, '.controller.ts');
  
  const controllerMatch = content.match(/@Controller\((?:['"](.*?)['"])?\)/);
  const controllerPrefix = controllerMatch && controllerMatch[1] ? controllerMatch[1] : '';
  
  apiDocs.push(`\n### Module: ${moduleName.toUpperCase()}`);
  apiDocs.push(`| HTTP Method | API Endpoint | Mục đích (Purpose) | Role yêu cầu |`);
  apiDocs.push(`|---|---|---|---|`);
  
  // We look backwards from the method to see if there's a @UseGuards
  // The regex matches @Method('route') [newlines/spaces] [async] functionName(
  const methodRegex = /@(Get|Post|Put|Patch|Delete)\((?:['"](.*?)['"])?\)[^@]*?(?:async\s+)?(\w+)\s*\(/g;
  let match;
  while ((match = methodRegex.exec(content)) !== null) {
    const method = match[1].toUpperCase();
    const route = match[2] ? `/${match[2]}` : '';
    let fullRoute = `/${controllerPrefix}${route}`.replace(/\/\//g, '/');
    if (fullRoute.endsWith('/') && fullRoute.length > 1) {
      fullRoute = fullRoute.slice(0, -1);
    }
    const functionName = match[3];
    
    // Check if there is @UseGuards on the method level (within 100 characters before the @Get/@Post)
    // or if the whole controller has @UseGuards.
    const methodContext = content.substring(Math.max(0, match.index - 150), match.index);
    const hasGuardMethod = methodContext.includes('@UseGuards');
    const hasGuardController = content.substring(0, 500).includes('@UseGuards');
    
    let role = 'Public';
    if (fullRoute.includes('/admin') || functionName.toLowerCase().includes('admin')) {
      role = 'Admin';
    } else if (hasGuardMethod || hasGuardController) {
      role = 'User/Owner';
    } else if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      role = 'User/Owner'; 
    }

    // Heuristic for purpose
    let purpose = functionName;
    if (functionName === 'create') purpose = 'Tạo mới bản ghi';
    else if (functionName === 'findAll') purpose = 'Lấy danh sách (có phân trang)';
    else if (functionName === 'findOne' || functionName === 'findOneBySlug') purpose = 'Lấy chi tiết một bản ghi';
    else if (functionName === 'update') purpose = 'Cập nhật bản ghi';
    else if (functionName === 'remove') purpose = 'Xóa bản ghi';
    else if (functionName === 'findAllForAdmin') purpose = 'Admin lấy toàn bộ danh sách';
    else if (functionName === 'updateStatus') purpose = 'Cập nhật trạng thái (Duyệt/Từ chối/Khóa)';
    else if (functionName === 'register') purpose = 'Đăng ký tài khoản';
    else if (functionName === 'login') purpose = 'Đăng nhập hệ thống';
    else if (functionName === 'getMyProposals') purpose = 'Lấy danh sách đề xuất của tôi';
    else if (functionName === 'getProposal') purpose = 'Lấy chi tiết đề xuất';
    else if (functionName === 'approveProposal') purpose = 'Phê duyệt đề xuất thay đổi';
    else if (functionName === 'rejectProposal') purpose = 'Từ chối đề xuất thay đổi';
    else if (functionName === 'getNotifications') purpose = 'Lấy danh sách thông báo';
    else if (functionName === 'markAllAsRead') purpose = 'Đánh dấu tất cả là đã đọc';
    else if (functionName === 'markAsRead') purpose = 'Đánh dấu 1 thông báo là đã đọc';
    else if (functionName === 'getMe' || functionName === 'getProfile') purpose = 'Lấy thông tin cá nhân (Profile)';
    else if (functionName === 'updateProfile') purpose = 'Cập nhật thông tin cá nhân';
    else {
      // make camelCase readable
      purpose = functionName.replace(/([A-Z])/g, ' $1').trim();
      purpose = purpose.charAt(0).toUpperCase() + purpose.slice(1);
    }

    apiDocs.push(`| **${method}** | \`/api/v1${fullRoute || '/'}\` | ${purpose} | ${role} |`);
  }
}

fs.writeFileSync(path.join(__dirname, 'docs/API_LIST.md'), '# Danh sách API (API Endpoints)\n\nDưới đây là danh sách toàn bộ các API hiện tại của hệ thống, được tạo tự động từ mã nguồn.\n\n' + apiDocs.join('\n'));
console.log('Done');
