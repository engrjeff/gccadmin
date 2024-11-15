import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  // level 1
  const level1 = await prisma.processLessonSeries.create({
    data: {
      title: "Leadership 1",
      description: "Collection of lessons for Leadership Level 1",
      tags: ["GPS", "Training", "Leadership"],
      lessons: {
        createMany: {
          data: [
            {
              title: "L1: The Truth About The Holy Bible",
              file_url:
                "https://drive.google.com/file/d/1lSt8_9ek9RRS28MxfDbJjAaH5WpjLtC5/view",
            },
            {
              title: "L2: The Truth About God",
              file_url:
                "https://drive.google.com/file/d/1-nXNUylT5RzDi8TPXy-hL3R3Ss0RZWtc/view?usp=drivesdk",
            },
            {
              title: "L3: 3x3 Prayer",
              file_url:
                "https://drive.google.com/file/d/1_ZK1WD58MgkbwIbH0oOVQYHhotq-tbrn/view?usp=drivesdk",
            },
            {
              title: "L4: The Abundance of Grace",
              file_url:
                "https://drive.google.com/file/d/1uI-Pg8tKNhZi_I26flLF6ICOyZSAYoEs/view?usp=drivesdk",
            },
            {
              title: "L5: Faith",
              file_url:
                "https://drive.google.com/file/d/1EZ0VysQiu8G8Dk1gDwaE_trW6wIQMMdu/view?usp=drivesdk",
            },
            {
              title: "L6: True Repentance",
              file_url:
                "https://drive.google.com/file/d/1UOuH6AjIRauo1-wFIBIUZDrIFHhCTqOG/view?usp=drivesdk",
            },
            {
              title: "L7: New Life in Christ",
              file_url:
                "https://drive.google.com/file/d/1XYB6Rz9nQwkHJDiQMIsn9wQBwU_Aftkk/view?usp=drivesdk",
            },
            {
              title: "L8: The Truth About Water Baptism",
              file_url:
                "https://drive.google.com/file/d/1XYzkZOs8VIMuDoWGKRRDR1s_jo0QyjWH/view?usp=drivesdk",
            },
            {
              title: "L9: The Truth About The Holy Spirit",
              file_url:
                "https://drive.google.com/file/d/1XaM6F9-QGpHJWDWo59V9kc0W068LcFuC/view?usp=drivesdk",
            },
            {
              title: "L10: Overcoming The Devil",
              file_url:
                "https://drive.google.com/file/d/1l-HgKpZRRroJMOdctQzAjOIaLlgYqLPu/view?usp=drive_link",
            },
          ],
        },
      },
    },
  })

  // level 1
  const level2 = await prisma.processLessonSeries.create({
    data: {
      title: "Leadership 2",
      description: "Collection of lessons for Leadership Level 2",
      tags: ["GPS", "Training", "Leadership"],
      lessons: {
        createMany: {
          data: [
            {
              title: "L0: Orientation",
              file_url:
                "https://drive.google.com/file/d/1L_zctFNU_RnQIomJOKO4HzVIkoqwA0E0/view?usp=drivesdk",
            },
            {
              title: "L1a: The Heart Of A Leader",
              file_url:
                "https://drive.google.com/file/d/1qNb4xU5iz-WjW6WXLDJ1IIcOKRa_415c/view?usp=drivesdk",
            },
            {
              title: "L1b: The 4W's Of A Cell Group",
              file_url:
                "https://drive.google.com/file/d/1infQBbNPfMCx5Xr0QRcEjolDJFtG-AFU/view?usp=drivesdk",
            },
            {
              title: "L2: Soul Winning Through The 3x3 Prayer",
              file_url:
                "https://drive.google.com/file/d/1i04xAkdA6fPJPIc2T00Fu6pjEGXacc1o/view?usp=drivesdk",
            },
            {
              title: "L3a: A Leader Prays",
              file_url:
                "https://drive.google.com/file/d/154pvYvMIkBwZLAVtlAe2iSguNSb4xsFs/view?usp=drivesdk",
            },
            {
              title: "L3b: Building Relationship with the New Believer",
              file_url:
                "https://drive.google.com/file/d/10jABoIRuXC7Sf1Pcg4D99yJrRKlcE23-/view?usp=drivesdk",
            },
            {
              title: "L4: The Four Important Aspects of Leadership",
              file_url:
                "https://drive.google.com/file/d/1GWpE9N2rRqe8INHRXxigmbwGMu3jHyBB/view?usp=drivesdk",
            },
            {
              title: "L5: The Qualities of a Leader",
              file_url:
                "https://drive.google.com/file/d/1xgtwVpV39L1m0VGOn8-uKyru0-_MZDwP/view?usp=drivesdk",
            },
            {
              title: "L6: Prayer as preparation for Soul winning",
              file_url:
                "https://drive.google.com/file/d/1kzizw3ICLd-05L3UOHzgdR7l3ax2PaLj/view?usp=drivesdk",
            },
            {
              title: "L7: Praying For Your Disciples",
              file_url:
                "https://drive.google.com/file/d/1bcP8oh_-Rmoctrd-6JkakzQRp-ms-uwV/view?usp=drivesdk",
            },
            {
              title: "L8: The Seed-Growing Prayer",
              file_url:
                "https://drive.google.com/file/d/1MK-v2_BxDJuwlSY-Q-Qi8JVV0MFQJuo9/view?usp=drivesdk",
            },
            {
              title: "L9: Spiritual Warfare",
              file_url:
                "https://drive.google.com/file/d/1OXG5CPuKbum3iCTJgm7jVevmjO80VUJC/view?usp=drivesdk",
            },
            {
              title: "L10: Appointed To Be Fruitful",
              file_url:
                "https://drive.google.com/file/d/1XY_nPChEkUbmRwqWtmCnCIRl9W5hB3I9/view?usp=drivesdk",
            },
          ],
        },
      },
    },
  })

  // level 3
  const level3 = await prisma.processLessonSeries.create({
    data: {
      title: "Leadership 3",
      description: "Collection of lessons for Leadership Level 3",
      tags: ["GPS", "Training", "Leadership"],
      lessons: {
        createMany: {
          data: [
            {
              title: "L0: An Introduction To Spiritual Gifts",
              file_url:
                "https://drive.google.com/file/d/123fCsp7pYzTCRs0mBOWu8UMAYpBSBHUE/view?usp=drive_link",
            },
            {
              title: "L1a: The Word Of Knowledge",
              file_url:
                "https://docs.google.com/presentation/d/1Fupak_WARrxVlAADVveQw7PlkZhBsHam/edit?usp=drive_link&ouid=110037262455150335278&rtpof=true&sd=true",
            },
            {
              title: "L1b: The Word Of Wisdom",
              file_url:
                "https://docs.google.com/presentation/d/1Fupak_WARrxVlAADVveQw7PlkZhBsHam/edit?usp=drive_link&ouid=110037262455150335278&rtpof=true&sd=true",
            },
            {
              title: "L2: The Gift Of Faith",
              file_url:
                "https://drive.google.com/file/d/1eRrhEl3Y_nATV_3GrJx6dpO-Mi4fMGTK/view?usp=drive_link",
            },
            {
              title: "L3: The Gifts Of Healing",
              file_url:
                "https://drive.google.com/file/d/1HJ-xDyXKNCbrI8INqOK5UzZzBGDVmlEH/view?usp=drive_link",
            },
            {
              title: "L4: The Working Of Miracles",
              file_url:
                "https://drive.google.com/file/d/14zSyh3D8H6nAm0U55rLG6HyGvOfOIgRB/view?usp=drive_link",
            },
            {
              title: "L5: The Gift Of Prophecy",
              file_url:
                "https://docs.google.com/presentation/d/19jI_q0QJthVgss_cnqRCaa6sprPtcE8I/edit?usp=drive_link&ouid=110037262455150335278&rtpof=true&sd=true",
            },
            {
              title:
                "L6: The Gift of Tongues And The Interpretation of Tongues",
              file_url:
                "https://drive.google.com/file/d/14j30c1uIU2h91a_oilLwW8tZTTdRtSIH/view?usp=drive_link",
            },
          ],
        },
      },
    },
  })

  console.log("Success!")
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
