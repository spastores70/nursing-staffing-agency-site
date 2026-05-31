import {
  PrismaClient,
  UserRole,
  UserStatus,
  JobType,
  JobStatus,
  ShiftType,
  ApplicationStatus,
  SubscriptionPlan,
  SubscriptionStatus,
  CertificationType,
} from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ─── Admin ─────────────────────────────────────────────────────────────────
  const adminPassword = await bcrypt.hash("Admin@123456", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@nurseconnect.com" },
    update: {},
    create: {
      email: "admin@nurseconnect.com",
      password: adminPassword,
      name: "Platform Admin",
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
      emailVerified: new Date(),
    },
  });
  console.log("✅ Admin created:", admin.email);

  // ─── Facilities ────────────────────────────────────────────────────────────
  const facilityPassword = await bcrypt.hash("Facility@123", 12);

  const facility1User = await prisma.user.upsert({
    where: { email: "contact@citymedical.com" },
    update: {},
    create: {
      email: "contact@citymedical.com",
      password: facilityPassword,
      name: "City Medical Center",
      role: UserRole.FACILITY,
      status: UserStatus.ACTIVE,
      emailVerified: new Date(),
    },
  });

  await prisma.facilityProfile.upsert({
    where: { userId: facility1User.id },
    update: {},
    create: {
      userId: facility1User.id,
      facilityName: "City Medical Center",
      facilityType: "Hospital",
      description:
        "A leading 500-bed hospital providing comprehensive medical care with state-of-the-art facilities and a team of dedicated healthcare professionals.",
      website: "https://citymedical.com",
      phone: "+1-555-0100",
      address: "1 Healthcare Blvd",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      bedCount: 500,
      accreditations: ["JCI", "JCAHO", "Magnet"],
      specialties: ["Cardiology", "Oncology", "Emergency Medicine", "Pediatrics"],
      isVerified: true,
      verifiedAt: new Date(),
      rating: 4.8,
      totalRatings: 245,
    },
  });

  const facility2User = await prisma.user.upsert({
    where: { email: "hr@sunshinecare.com" },
    update: {},
    create: {
      email: "hr@sunshinecare.com",
      password: facilityPassword,
      name: "Sunshine Care Home",
      role: UserRole.FACILITY,
      status: UserStatus.ACTIVE,
      emailVerified: new Date(),
    },
  });

  const facility2Profile = await prisma.facilityProfile.upsert({
    where: { userId: facility2User.id },
    update: {},
    create: {
      userId: facility2User.id,
      facilityName: "Sunshine Care Home",
      facilityType: "Nursing Home",
      description:
        "Premier long-term care facility dedicated to providing compassionate care for elderly residents.",
      phone: "+1-555-0200",
      address: "45 Maple Street",
      city: "Los Angeles",
      state: "CA",
      zipCode: "90001",
      bedCount: 120,
      accreditations: ["CMS", "CARF"],
      specialties: ["Geriatrics", "Memory Care", "Rehabilitation"],
      isVerified: true,
      verifiedAt: new Date(),
      rating: 4.6,
      totalRatings: 128,
    },
  });

  // Facility subscriptions
  const facility1Profile = await prisma.facilityProfile.findUnique({
    where: { userId: facility1User.id },
  });
  if (facility1Profile) {
    await prisma.subscription.upsert({
      where: { facilityProfileId: facility1Profile.id },
      update: {},
      create: {
        facilityProfileId: facility1Profile.id,
        plan: SubscriptionPlan.FACILITY_PRO,
        status: SubscriptionStatus.ACTIVE,
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        stripeCustomerId: "cus_facility1_demo",
        stripeSubscriptionId: "sub_facility1_demo",
      },
    });
  }

  // ─── Nurses ────────────────────────────────────────────────────────────────
  const nursePassword = await bcrypt.hash("Nurse@123", 12);

  const nurse1User = await prisma.user.upsert({
    where: { email: "sarah.johnson@email.com" },
    update: {},
    create: {
      email: "sarah.johnson@email.com",
      password: nursePassword,
      name: "Sarah Johnson",
      role: UserRole.NURSE,
      status: UserStatus.ACTIVE,
      emailVerified: new Date(),
      phone: "+1-555-1001",
    },
  });

  const nurse1Profile = await prisma.nurseProfile.upsert({
    where: { userId: nurse1User.id },
    update: {},
    create: {
      userId: nurse1User.id,
      bio: "Experienced ICU Registered Nurse with 8 years of critical care experience. Passionate about patient-centered care and evidence-based practice.",
      specializations: ["ICU", "Critical Care", "Cardiac Care"],
      yearsOfExperience: 8,
      education: "BSN, University of Pennsylvania",
      currentLocation: "New York, NY",
      willingToRelocate: true,
      preferredLocations: ["New York", "New Jersey", "Connecticut"],
      preferredJobTypes: [JobType.FULL_TIME, JobType.CONTRACT],
      preferredShifts: [ShiftType.DAY, ShiftType.NIGHT],
      expectedSalaryMin: 85000,
      expectedSalaryMax: 110000,
      profileComplete: true,
      isAvailable: true,
      rating: 4.9,
      totalRatings: 32,
    },
  });

  await prisma.nurseCertification.createMany({
    skipDuplicates: true,
    data: [
      {
        nurseProfileId: nurse1Profile.id,
        type: CertificationType.RN,
        name: "Registered Nurse License",
        issuingBody: "New York State Board of Nursing",
        licenseNumber: "RN-NY-123456",
        issueDate: new Date("2016-06-15"),
        expiryDate: new Date("2026-06-15"),
        isVerified: true,
        verifiedAt: new Date(),
      },
      {
        nurseProfileId: nurse1Profile.id,
        type: CertificationType.OTHER,
        name: "CCRN - Critical Care Registered Nurse",
        issuingBody: "AACN",
        licenseNumber: "CCRN-456789",
        issueDate: new Date("2020-03-01"),
        expiryDate: new Date("2026-03-01"),
        isVerified: true,
        verifiedAt: new Date(),
      },
    ],
  });

  await prisma.workExperience.createMany({
    skipDuplicates: true,
    data: [
      {
        nurseProfileId: nurse1Profile.id,
        title: "Senior ICU Nurse",
        facility: "Mount Sinai Hospital",
        location: "New York, NY",
        startDate: new Date("2019-01-01"),
        isCurrent: true,
        description: "Managing complex ICU patients including post-cardiac surgery, ARDS, and multi-organ failure.",
      },
      {
        nurseProfileId: nurse1Profile.id,
        title: "ICU Nurse",
        facility: "NYU Langone Health",
        location: "New York, NY",
        startDate: new Date("2016-07-01"),
        endDate: new Date("2018-12-31"),
        isCurrent: false,
        description: "Provided critical care nursing for medical-surgical ICU patients.",
      },
    ],
  });

  const nurse2User = await prisma.user.upsert({
    where: { email: "michael.chen@email.com" },
    update: {},
    create: {
      email: "michael.chen@email.com",
      password: nursePassword,
      name: "Michael Chen",
      role: UserRole.NURSE,
      status: UserStatus.ACTIVE,
      emailVerified: new Date(),
      phone: "+1-555-1002",
    },
  });

  const nurse2Profile = await prisma.nurseProfile.upsert({
    where: { userId: nurse2User.id },
    update: {},
    create: {
      userId: nurse2User.id,
      bio: "Travel nurse with expertise in Emergency Medicine and Trauma care. 6 years of experience across multiple states.",
      specializations: ["Emergency Medicine", "Trauma", "ACLS"],
      yearsOfExperience: 6,
      education: "BSN, UCLA School of Nursing",
      currentLocation: "Los Angeles, CA",
      willingToRelocate: true,
      preferredLocations: ["California", "Texas", "Florida"],
      preferredJobTypes: [JobType.TRAVEL, JobType.CONTRACT],
      preferredShifts: [ShiftType.NIGHT, ShiftType.ROTATING],
      expectedSalaryMin: 90000,
      expectedSalaryMax: 130000,
      profileComplete: true,
      isAvailable: true,
      rating: 4.7,
      totalRatings: 18,
    },
  });

  await prisma.nurseCertification.create({
    data: {
      nurseProfileId: nurse2Profile.id,
      type: CertificationType.RN,
      name: "Registered Nurse License",
      issuingBody: "California Board of Registered Nursing",
      licenseNumber: "RN-CA-789012",
      issueDate: new Date("2018-08-01"),
      expiryDate: new Date("2026-08-01"),
      isVerified: true,
      verifiedAt: new Date(),
    },
  });

  const nurse3User = await prisma.user.upsert({
    where: { email: "emily.davis@email.com" },
    update: {},
    create: {
      email: "emily.davis@email.com",
      password: nursePassword,
      name: "Emily Davis",
      role: UserRole.NURSE,
      status: UserStatus.ACTIVE,
      emailVerified: new Date(),
      phone: "+1-555-1003",
    },
  });

  const nurse3Profile = await prisma.nurseProfile.upsert({
    where: { userId: nurse3User.id },
    update: {},
    create: {
      userId: nurse3User.id,
      bio: "Pediatric Nurse Practitioner with 10 years of experience in pediatric care settings.",
      specializations: ["Pediatrics", "Neonatology", "Pediatric ICU"],
      yearsOfExperience: 10,
      education: "MSN/NP, Vanderbilt University",
      currentLocation: "Chicago, IL",
      willingToRelocate: false,
      preferredJobTypes: [JobType.FULL_TIME],
      preferredShifts: [ShiftType.DAY],
      expectedSalaryMin: 95000,
      expectedSalaryMax: 125000,
      profileComplete: true,
      isAvailable: false,
      rating: 4.9,
      totalRatings: 47,
    },
  });

  // ─── Jobs ──────────────────────────────────────────────────────────────────
  if (facility1Profile) {
    const job1 = await prisma.job.create({
      data: {
        facilityId: facility1Profile.id,
        title: "ICU Registered Nurse",
        description:
          "We are seeking a skilled and compassionate ICU Registered Nurse to join our Level 1 Trauma Center. You will be responsible for providing critical care to patients in our 30-bed intensive care unit.",
        requirements:
          "• Active RN license in New York\n• Minimum 2 years ICU experience\n• CCRN certification preferred\n• BLS and ACLS required\n• Strong critical thinking and communication skills",
        responsibilities:
          "• Assess and monitor critically ill patients\n• Administer medications and treatments\n• Collaborate with multidisciplinary team\n• Document patient care accurately\n• Educate patients and families",
        jobType: JobType.FULL_TIME,
        shiftType: ShiftType.NIGHT,
        specializations: ["ICU", "Critical Care"],
        location: "New York, NY",
        city: "New York",
        state: "NY",
        salaryMin: 95000,
        salaryMax: 125000,
        salaryUnit: "YEAR",
        benefits: [
          "Health Insurance",
          "Dental & Vision",
          "401(k) with 5% Match",
          "Sign-on Bonus $10,000",
          "Relocation Assistance",
        ],
        positions: 3,
        status: JobStatus.OPEN,
        expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        viewCount: 245,
      },
    });

    await prisma.job.create({
      data: {
        facilityId: facility1Profile.id,
        title: "Emergency Room Nurse",
        description:
          "Join our dynamic Emergency Department team. We're looking for an experienced ER Nurse who thrives in a fast-paced environment.",
        requirements:
          "• Active RN license\n• 1+ year ER experience\n• BLS, ACLS, TNCC required\n• Emergency nursing certification (CEN) preferred",
        responsibilities:
          "• Triage and assess emergency patients\n• Initiate and manage emergency interventions\n• Coordinate with physicians and specialists\n• Maintain accurate documentation",
        jobType: JobType.FULL_TIME,
        shiftType: ShiftType.ROTATING,
        specializations: ["Emergency Medicine", "Trauma"],
        location: "New York, NY",
        city: "New York",
        state: "NY",
        salaryMin: 85000,
        salaryMax: 110000,
        salaryUnit: "YEAR",
        benefits: [
          "Comprehensive Health Benefits",
          "Student Loan Repayment",
          "Tuition Reimbursement",
          "Shift Differentials",
        ],
        positions: 5,
        status: JobStatus.OPEN,
        expiresAt: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        viewCount: 312,
      },
    });

    // Application
    const app1 = await prisma.application.create({
      data: {
        jobId: job1.id,
        nurseProfileId: nurse1Profile.id,
        coverLetter:
          "I am excited to apply for the ICU Registered Nurse position at City Medical Center. With 8 years of critical care experience and CCRN certification, I am confident in my ability to provide exceptional patient care...",
        status: ApplicationStatus.SHORTLISTED,
        reviewedAt: new Date(),
      },
    });

    await prisma.interview.create({
      data: {
        applicationId: app1.id,
        scheduledAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        duration: 60,
        type: "VIDEO",
        meetingLink: "https://meet.google.com/demo-link",
        status: "SCHEDULED",
        notes: "Please have your license and CCRN certification ready to share.",
      },
    });
  }

  if (facility2Profile) {
    await prisma.job.create({
      data: {
        facilityId: facility2Profile.id,
        title: "Geriatric Care LPN",
        description:
          "Sunshine Care Home is looking for a compassionate LPN to provide quality care to our elderly residents in a warm, home-like environment.",
        requirements:
          "• Active LPN license in California\n• Experience in long-term care preferred\n• CPR certified\n• Excellent interpersonal skills",
        responsibilities:
          "• Provide direct nursing care to residents\n• Administer medications\n• Monitor resident health status\n• Communicate with families\n• Document care provided",
        jobType: JobType.FULL_TIME,
        shiftType: ShiftType.EVENING,
        specializations: ["Geriatrics", "Long-term Care"],
        location: "Los Angeles, CA",
        city: "Los Angeles",
        state: "CA",
        salaryMin: 55000,
        salaryMax: 70000,
        salaryUnit: "YEAR",
        benefits: ["Health Insurance", "Paid Time Off", "Holiday Pay", "Free Parking"],
        positions: 2,
        status: JobStatus.OPEN,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        viewCount: 89,
      },
    });

    await prisma.application.create({
      data: {
        jobId: (await prisma.job.findFirst({ where: { facilityId: facility2Profile.id } }))!.id,
        nurseProfileId: nurse2Profile.id,
        coverLetter: "I am applying for the travel nursing position...",
        status: ApplicationStatus.PENDING,
      },
    });
  }

  // ─── Notifications ─────────────────────────────────────────────────────────
  await prisma.notification.createMany({
    data: [
      {
        userId: nurse1User.id,
        type: "APPLICATION_STATUS",
        title: "Application Update",
        message: "Your application for ICU Registered Nurse at City Medical Center has been shortlisted!",
        data: { applicationId: "app1" },
        isRead: false,
      },
      {
        userId: nurse1User.id,
        type: "INTERVIEW_SCHEDULED",
        title: "Interview Scheduled",
        message: "Your video interview for ICU Registered Nurse is scheduled for next week.",
        data: { interviewId: "int1" },
        isRead: false,
      },
      {
        userId: facility1User.id,
        type: "APPLICATION_RECEIVED",
        title: "New Application Received",
        message: "Sarah Johnson has applied for the ICU Registered Nurse position.",
        data: { applicationId: "app1" },
        isRead: true,
      },
    ],
  });

  // ─── System Settings ───────────────────────────────────────────────────────
  await prisma.systemSetting.createMany({
    skipDuplicates: true,
    data: [
      { key: "platform_name", value: "NurseConnect" },
      { key: "support_email", value: "support@nurseconnect.com" },
      { key: "facility_monthly_price", value: "299" },
      { key: "facility_annual_price", value: "2990" },
      { key: "nurse_pro_monthly_price", value: "29" },
      { key: "max_job_posts_free", value: "2" },
      { key: "max_job_posts_basic", value: "10" },
      { key: "max_job_posts_pro", value: "unlimited" },
      { key: "registration_requires_approval", value: "true" },
    ],
  });

  console.log("✅ Database seeded successfully!");
  console.log("\n📋 Demo Credentials:");
  console.log("  Admin:    admin@nurseconnect.com / Admin@123456");
  console.log("  Facility: contact@citymedical.com / Facility@123");
  console.log("  Nurse:    sarah.johnson@email.com / Nurse@123");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
