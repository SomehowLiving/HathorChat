import fs from 'fs';
import path from 'path';

const filePath = path.join(__dirname, '../../data/users.json');

function loadUsers() {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '[]');
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

export function getUserByTelegramId(telegramId: string) {
  const users = loadUsers();
  return users.find((u: any) => u.telegramId === telegramId);
}

export function saveUser(user: any) {
  const users = loadUsers();
  const index = users.findIndex((u: any) => u.telegramId === user.telegramId);
  if (index >= 0) users[index] = user;
  else users.push(user);
  fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
}
