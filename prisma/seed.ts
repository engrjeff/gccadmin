import {
  CellStatus,
  ChurchStatus,
  Gender,
  MemberType,
  PrismaClient,
  ProcessLevel,
} from "@prisma/client"

import gccMembersData from "../gcc_members_data.json"

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
      process_level: "LEADERSHIP_3",
      cell_status: "REGULAR",
      church_status: "REGULAR",
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
        process_level: "LEADERSHIP_3",
        cell_status: "REGULAR",
        church_status: "REGULAR",
        isPrimary: true,
        leaderId: adminAsDisciple.id,
      },
      {
        name: "Jeff Segovia",
        address: "Morong, Rizal",
        birthdate: new Date("1996-03-12"),
        gender: "MALE",
        member_type: "YOUNGPRO",
        process_level: "LEADERSHIP_2",
        cell_status: "REGULAR",
        church_status: "REGULAR",
        isPrimary: true,
        leaderId: adminAsDisciple.id,
      },
      {
        name: "Kim Lopez",
        address: "Antipolo City",
        birthdate: new Date("1993-08-26"),
        gender: "FEMALE",
        member_type: "YOUNGPRO",
        process_level: "LEADERSHIP_2",
        cell_status: "REGULAR",
        church_status: "REGULAR",
        isPrimary: true,
        leaderId: adminAsDisciple.id,
      },
      {
        name: "Carlo Rosal",
        address: "Cardona, Rizal",
        birthdate: new Date("1996-03-29"),
        gender: "MALE",
        member_type: "YOUNGPRO",
        process_level: "LEADERSHIP_2",
        cell_status: "REGULAR",
        church_status: "REGULAR",
        isPrimary: true,
        leaderId: adminAsDisciple.id,
      },
      {
        name: "Leslie Henoguin",
        address: "Morong, Rizal",
        birthdate: new Date("1997-10-24"),
        gender: "FEMALE",
        member_type: "YOUNGPRO",
        process_level: "LEADERSHIP_2",
        cell_status: "REGULAR",
        church_status: "REGULAR",
        isPrimary: true,
        leaderId: adminAsDisciple.id,
      },
      {
        name: "Gary Peña",
        address: "Morong, Rizal",
        birthdate: new Date("1997-10-24"),
        gender: "MALE",
        member_type: "YOUNGPRO",
        process_level: "LEADERSHIP_2",
        cell_status: "REGULAR",
        church_status: "REGULAR",
        isPrimary: true,
        leaderId: adminAsDisciple.id,
      },
      {
        name: "Aerol Allauigan",
        address: "Tanay, Rizal",
        birthdate: new Date("1997-08-24"),
        gender: "MALE",
        member_type: "YOUNGPRO",
        process_level: "LEADERSHIP_2",
        cell_status: "REGULAR",
        church_status: "REGULAR",
        isPrimary: true,
        leaderId: adminAsDisciple.id,
      },
      {
        name: "Marvin Palabon",
        address: "Antipolo City",
        birthdate: new Date("1995-10-24"),
        gender: "MALE",
        member_type: "YOUNGPRO",
        process_level: "LEADERSHIP_2",
        cell_status: "REGULAR",
        church_status: "REGULAR",
        isPrimary: true,
        leaderId: adminAsDisciple.id,
      },
      {
        name: "Rosalinda Sahagun",
        address: "Morong, Rizal",
        birthdate: new Date("1995-10-24"),
        gender: "FEMALE",
        member_type: "WOMEN",
        process_level: "LEADERSHIP_2",
        cell_status: "REGULAR",
        church_status: "REGULAR",
        isPrimary: true,
        leaderId: adminAsDisciple.id,
      },
      {
        name: "Eugene Ababa",
        address: "Tanay, Rizal",
        birthdate: new Date("1995-10-24"),
        gender: "MALE",
        member_type: "YOUNGPRO",
        process_level: "LEADERSHIP_2",
        cell_status: "REGULAR",
        church_status: "REGULAR",
        isPrimary: true,
        leaderId: adminAsDisciple.id,
      },
    ],
  })

  console.log("Created leaders: ", leaders.count)

  // create a leader_name : id look up
  const leadersData = await prisma.disciple.findMany({
    where: { isPrimary: true },
  })

  const leadersLookup = leadersData.reduce<{ [key: string]: string }>(
    (lookup, curr) => {
      return {
        ...lookup,
        [curr.name]: curr.id,
      }
    },
    {}
  )

  const gccMembers = await prisma.disciple.createMany({
    data: gccMembersData.map(({ leader_name, birthdate, ...m }) => ({
      name: m.name,
      address: m.address,
      gender: m.gender as Gender,
      birthdate: new Date("1990-01-01"),
      member_type: m.member_type as MemberType,
      process_level: m.process_level as ProcessLevel,
      cell_status: m.cell_status as CellStatus,
      church_status: m.church_status as ChurchStatus,
      leaderId: leadersLookup[leader_name],
    })),
  })

  console.log("Inserted GCC members", gccMembers.count)

  // seed series
  const series = await prisma.lessonSeries.createMany({
    data: [
      {
        title: "Soul Winning",
        description: "Lessons for Soul-Winning or Evangelism",
        tags: ["gospel", "soul-winning", "evangelism"],
      },
      {
        title: "Consolidation",
        description: "Follow-up lessons for new believers (Luke 15)",
        tags: ["discipleship"],
      },
      {
        title: "Discipleship 101",
        description: "In-depth discipleship lessons for closed cells",
        tags: ["discipleship", "doctrines"],
      },
      {
        title: "The Three Stages of Redemption",
        description: "Truths about the redemption of the elect",
        tags: ["Christ", "redemption"],
      },
    ],
  })

  console.log("Created Lesson Series: ", series.count)

  // get the series ids
  const seriesIds = await prisma.lessonSeries.findMany({
    select: {
      id: true,
      title: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  })

  // add lessons for each series
  const a = await prisma.lesson.createMany({
    data: [
      {
        title: "The Love of God",
        scripture_references: ["John 3:16"],
        lesson_series_id: seriesIds[0].id,
      },
      {
        title: "Saved By Grace",
        scripture_references: ["Ephesians 2:8-9"],
        lesson_series_id: seriesIds[0].id,
      },
      {
        title: "From Death to Life",
        scripture_references: ["Romans 6:23"],
        lesson_series_id: seriesIds[0].id,
      },
      {
        title: "Gift of No Condemnation",
        scripture_references: ["Romans 8:1"],
        lesson_series_id: seriesIds[0].id,
      },
    ],
  })

  const b = await prisma.lesson.createMany({
    data: [
      {
        title: "Returning to the Father",
        scripture_references: ["Luke 15"],
        lesson_series_id: seriesIds[1].id,
      },
      {
        title: "The Father's Love",
        scripture_references: ["Luke 15"],
        lesson_series_id: seriesIds[1].id,
      },
      {
        title: "The Father Has Something For You",
        scripture_references: ["Luke 15"],
        lesson_series_id: seriesIds[1].id,
      },
      {
        title: "Son, Not Servant",
        scripture_references: ["Luke 15"],
        lesson_series_id: seriesIds[1].id,
      },
      {
        title: "Talk to Your Father",
        scripture_references: ["Luke 15"],
        lesson_series_id: seriesIds[1].id,
      },
    ],
  })

  const c = await prisma.lesson.createMany({
    data: [
      {
        title: "God's Saving Grace",
        scripture_references: ["Ephesians 2:8-9"],
        lesson_series_id: seriesIds[2].id,
      },
      {
        title: "Justification by Faith",
        scripture_references: ["Romans 4:1-6", "Romans 3:20-21"],
        lesson_series_id: seriesIds[2].id,
      },
      {
        title: " Justification: Accounting",
        scripture_references: ["Romans 4:1-6", "Romans 3:20-21"],
        lesson_series_id: seriesIds[2].id,
      },
      {
        title: "New Birth",
        scripture_references: ["John 3:3-7"],
        lesson_series_id: seriesIds[2].id,
      },
      {
        title: "Passover",
        scripture_references: ["Exodus 12"],
        lesson_series_id: seriesIds[2].id,
      },
    ],
  })

  const d = await prisma.lesson.createMany({
    data: [
      {
        title: "The Three Stages of Redemption: Overview",
        lesson_series_id: seriesIds[3].id,
        scripture_references: ["1 Corinthians 11:24-30"],
      },
      {
        title: "The Three Stages of Redemption: Weakness Stage",
        lesson_series_id: seriesIds[3].id,
        scripture_references: ["1 Corinthians 11:24-30"],
      },
      {
        title: "The Price of Intimacy",
        lesson_series_id: seriesIds[3].id,
        scripture_references: ["1 Corinthians 11:24-30"],
      },
      {
        title: "The Price of a Servant",
        lesson_series_id: seriesIds[3].id,
        scripture_references: ["1 Corinthians 11:24-30"],
      },
      {
        title: "The Perfect Offering - Part 1",
        lesson_series_id: seriesIds[3].id,
        scripture_references: ["1 Corinthians 11:24-30"],
      },
      {
        title: "The Perfect Offering - Part 2",
        lesson_series_id: seriesIds[3].id,
        scripture_references: ["1 Corinthians 11:24-30"],
      },
      {
        title: "The Perfect Offering - Part 3",
        lesson_series_id: seriesIds[3].id,
        scripture_references: ["1 Corinthians 11:24-30"],
      },
      {
        title: "The Perfect Offering - Part 4",
        lesson_series_id: seriesIds[3].id,
        scripture_references: ["1 Corinthians 11:24-30"],
      },
      {
        title: "Sickness Stage - Part 1",
        lesson_series_id: seriesIds[3].id,
        scripture_references: ["1 Corinthians 11:24-30"],
      },
      {
        title: "Sickness Stage - Part 2",
        lesson_series_id: seriesIds[3].id,
        scripture_references: ["1 Corinthians 11:24-30"],
      },
      {
        title: "The Crown of Thorns : Sickness Stage - Part 3",
        lesson_series_id: seriesIds[3].id,
        scripture_references: ["1 Corinthians 11:24-30"],
      },
      {
        title: "Restored Dominion : Sickness Stage - Part 4",
        lesson_series_id: seriesIds[3].id,
        scripture_references: ["1 Corinthians 11:24-30"],
      },
      {
        title: "The Substitute",
        lesson_series_id: seriesIds[3].id,
        scripture_references: ["1 Corinthians 11:24-30"],
      },
    ],
  })

  console.log(`Created lessons for ${seriesIds[0].title}`, a.count)
  console.log(`Created lessons for ${seriesIds[1].title}`, b.count)
  console.log(`Created lessons for ${seriesIds[2].title}`, c.count)
  console.log(`Created lessons for ${seriesIds[3].title}`, d.count)
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
