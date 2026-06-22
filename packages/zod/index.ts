import * as z from "zod";

const User = z.object({
  name: z.string().min(3).max(255),
  email: z.email(),
  password: z.string().min(2).max(512),
  role: z.enum(["user", "admin,", "course_creator"]),
});

// some untrusted data...
const input = {
  /* stuff */
};

// the parsed result is validated and type safe!
const data = User.parse(input);

// so you can use it with confidence :)
console.log(data.name);
