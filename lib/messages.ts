import { prisma } from './prisma'

// Lab 1: Create + Read
export async function addMessage(data: { name: string; email: string; message: string; tag?: string }) {
    return prisma.message.create({ data })
}


export async function getMessages() {
    return prisma.message.findMany({
        orderBy: { createdAt: 'desc' },
    })
}

export async function getMessageById(id: string) {
    return prisma.message.findUnique({
        where: { id },
    })
}

// Lab 2: Update
export async function updateMessage(id: string, updates: { message: string }) {
    return prisma.message.update({
        where: { id },
        data: updates,
    })
}

// Lab 3: Delete
export async function deleteMessage(id: string) {
    return prisma.message.delete({
        where: { id },
    })
}