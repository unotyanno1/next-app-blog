import { PrismaClient } from "@prisma/client";
import * as bcrypt from 'bcryptjs'
import { disconnect } from "process";

const prisma = new PrismaClient()

async function main() {
    // クリーンアップ
    await prisma.post.deleteMany()
    await prisma.user.deleteMany()

    const hashedPassword = await bcrypt.hash('password123', 12)

    // ダミー画像URL
    const dummyImages = [
        'https://picsum.photos/seed/post1/600/400',
        'https://picsum.photos/seed/post2/600/400'
    ]

    // ユーザー作成
    const user = await prisma.user.create({
        data: {
            email: 'test@example.com',
            name: 'Test User',
            password: hashedPassword,
            posts: {
                create: [
                    {
                        title: 'はじめてのブログ投稿',
                        content: 'これは最初のブログ投稿です。',
                        topImage: dummyImages[0],
                    },
                    {
                        title: '二番目の投稿',
                        content: 'これは二番目のブログ投稿です。',
                        topImage: dummyImages[1],
                    }
                ]
            }
        }
    })

    console.log({ user })
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })