export interface GetProductByIdOutputDto {
    id: string;
    name: string;
    description: string;
    price: {
        amount: number;
        currency: string;
    };
    image: string;
    stock: number;
    createdAt: Date;
    updatedAt: Date;
}