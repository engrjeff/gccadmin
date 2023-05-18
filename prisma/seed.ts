import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const ADMIN_EMAIL = "gccsystemph@gmail.com"

async function main() {
  // make sure the admin already exists (signed in!)
  let admin = await prisma.user.findFirst({
    where: {
      email: ADMIN_EMAIL,
    },
  })

  if (!admin) throw new Error("Make sure the admin email is registered first")

  // assign a role of ADMIN
  await prisma.user.update({
    where: {
      email: ADMIN_EMAIL,
    },
    data: {
      role: "ADMIN",
    },
  })

  // create a disciple admin
  const adminAsDisciple = await prisma.disciple.create({
    data: {
      name: "GCC Admin",
      address: "Morong, Rizal",
      birthdate: new Date("1996-03-12"),
      gender: "MALE",
      member_type: "YOUNGPRO",
      process_level: "LEADERSHIP3",
      userAccountId: admin.id,
    },
    select: {
      id: true,
    },
  })

  // insert the primary leaders
  const leaders = await prisma.disciple.createMany({
    data: [
      {
        name: "John De Guzman",
        address: "Morong, Rizal",
        birthdate: new Date("1996-03-12"),
        gender: "MALE",
        member_type: "YOUNGPRO",
        process_level: "LEADERSHIP3",
        isPrimary: true,
        leaderId: adminAsDisciple.id,
      },
      {
        name: "Jeff Segovia",
        address: "Morong, Rizal",
        birthdate: new Date("1996-03-12"),
        gender: "MALE",
        member_type: "YOUNGPRO",
        process_level: "LEADERSHIP2",
        isPrimary: true,
        leaderId: adminAsDisciple.id,
      },
      {
        name: "Kim Lopez",
        address: "Antipolo City",
        birthdate: new Date("1993-08-26"),
        gender: "FEMALE",
        member_type: "YOUNGPRO",
        process_level: "LEADERSHIP2",
        isPrimary: true,
        leaderId: adminAsDisciple.id,
      },
      {
        name: "Carlo Rosal",
        address: "Cardona, Rizal",
        birthdate: new Date("1996-03-29"),
        gender: "MALE",
        member_type: "YOUNGPRO",
        process_level: "LEADERSHIP2",
        isPrimary: true,
        leaderId: adminAsDisciple.id,
      },
      {
        name: "Leslie Henoguin",
        address: "Morong, Rizal",
        birthdate: new Date("1997-10-24"),
        gender: "FEMALE",
        member_type: "YOUNGPRO",
        process_level: "LEADERSHIP2",
        isPrimary: true,
        leaderId: adminAsDisciple.id,
      },
      {
        name: "Gary Peña",
        address: "Morong, Rizal",
        birthdate: new Date("1997-10-24"),
        gender: "MALE",
        member_type: "YOUNGPRO",
        process_level: "LEADERSHIP2",
        isPrimary: true,
        leaderId: adminAsDisciple.id,
      },
      {
        name: "Aerol Allauigan",
        address: "Tanay, Rizal",
        birthdate: new Date("1997-08-24"),
        gender: "MALE",
        member_type: "YOUNGPRO",
        process_level: "LEADERSHIP2",
        isPrimary: true,
        leaderId: adminAsDisciple.id,
      },
      {
        name: "Marvin Palabon",
        address: "Antipolo City",
        birthdate: new Date("1995-10-24"),
        gender: "MALE",
        member_type: "YOUNGPRO",
        process_level: "LEADERSHIP2",
        isPrimary: true,
        leaderId: adminAsDisciple.id,
      },
      {
        name: "Rosalinda Sahagun",
        address: "Morong, Rizal",
        birthdate: new Date("1995-10-24"),
        gender: "FEMALE",
        member_type: "WOMEN",
        process_level: "LEADERSHIP2",
        isPrimary: true,
        leaderId: adminAsDisciple.id,
      },
      {
        name: "Eugene Ababa",
        address: "Tanay, Rizal",
        birthdate: new Date("1995-10-24"),
        gender: "MALE",
        member_type: "YOUNGPRO",
        process_level: "LEADERSHIP2",
        isPrimary: true,
        leaderId: adminAsDisciple.id,
      },
    ],
  })

  console.log("Created leaders: ", leaders.count)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    if (e instanceof Error) {
      console.error(e.message)
    } else {
      console.error(e)
    }

    await prisma.$disconnect()
    process.exit(1)
  })
