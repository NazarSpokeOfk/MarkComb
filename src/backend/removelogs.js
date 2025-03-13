import fs from "fs"
import path from "path";

function removeConsoleLogs(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      removeConsoleLogs(filePath);  // Рекурсивный вызов для подкаталогов
    } else if (filePath.endsWith('.js')) {
      let content = fs.readFileSync(filePath, 'utf-8');
      content = content.replace(/console\.log\(.*\);?/g, '');  // Удаляем console.log
      fs.writeFileSync(filePath, content, 'utf-8');
    }
  });
}

removeConsoleLogs('./');  // Укажи путь к твоему бэкенду
