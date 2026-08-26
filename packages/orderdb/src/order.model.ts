import mongoose, { InferSchemaType } from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    stripeSessionId: { type: String },
    email: { type: String, required: true },
    userId: { type: String, required: false },
    ammount: { type: Number, required: true },
    status: { type: String, enum: ["delivered", "pending", "paid"] },
    products: {
      type: [
        {
          _id: false,
          name: { type: String, required: true },
          quantity: { type: Number, required: true },
          price: { type: Number, required: true },
          size: { type: String },
          color: { type: String },
          category: { type: String },
        },
      ],
      required: true,
    },
    shippingAddress: { type: String, required: true },
  },

  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

OrderSchema.virtual("totalProducts").get(function () {
  const items = this.products as unknown as
    | Array<{ quantity: number }>
    | undefined;

  return items?.length || 0;
});
export type OrderSchemaType = InferSchemaType<typeof OrderSchema>;
export const Order = mongoose.model<OrderSchemaType>("Order", OrderSchema);
