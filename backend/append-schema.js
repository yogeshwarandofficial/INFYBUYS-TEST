const fs = require('fs');
const content = `

enum NotificationType {
  NEW_ENQUIRY
  NEW_MESSAGE
  KYC_APPROVED
  KYC_REJECTED
  LISTING_APPROVED
  LISTING_REJECTED
  NDA_REQUESTED
  NDA_SIGNED
  SAVED_SEARCH_MATCH
}

model Notification {
  id        String           @id @default(uuid())
  userId    String
  type      NotificationType
  title     String
  message   String
  link      String?
  isRead    Boolean          @default(false)
  createdAt DateTime         @default(now())

  @@index([userId, isRead])
  @@index([userId, createdAt])
}
`;
fs.appendFileSync('d:/Infynux/INFYBUYS/backend/prisma/schema.prisma', content);
