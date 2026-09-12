import z from "zod";

export const signInSchema = z.object({
  email: z.email("Địa chỉ email không hợp lệ"),
  password: z
    .string("Mật khẩu không hợp lệ")
    .min(8, "Mật khẩu phải có độ dài tối thiểu 8 ký tự"),
});
