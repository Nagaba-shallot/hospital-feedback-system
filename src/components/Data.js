export const hospitalReviewQuestions = [
  {
    category: "Access & Arrival",
    questions: [
      {
        id: "access_01",
        text: "How easy was it to schedule your appointment?",
        type: "rating",
      },
      {
        id: "access_02",
        text: "How would you rate the wait time in the reception area?",
        type: "rating",
      },
      {
        id: "access_03",
        text: "Were you able to find your way around the facility easily?",
        type: "rating",
      },
      {
        id: "access_04",
        text: "Was the check-in staff professional and welcoming?",
        type: "rating",
      },
      {
        id: "access_05",
        text: "Was valet, parking, or drop-off accessible and convenient?",
        type: "rating",
      },
    ],
  },
  {
    category: "Emergency Department (ED)",
    questions: [
      {
        id: "ed_01",
        text: "How would you rate the comfort of the ED waiting area?",
        type: "rating",
      },
      {
        id: "ed_02",
        text: "Did staff keep you informed about expected wait times?",
        type: "rating",
      },
      {
        id: "ed_03",
        text: "How long did you wait to be moved from the waiting room to an exam room?",
        type: "text",
      },
      {
        id: "ed_04",
        text: "Did ED health professionals provide support for your worries or fears?",
        type: "rating",
      },
      {
        id: "ed_05",
        text: "Overall, did you feel you were treated with respect and dignity while in the ED?",
        type: "rating",
      },
    ],
  },
  {
    category: "Virtual Care & Telehealth",
    questions: [
      {
        id: "tele_01",
        text: "How easy was it to connect to your virtual or video visit?",
        type: "rating",
      },
      {
        id: "tele_02",
        text: "Did you experience any technical or audio/video issues during your call?",
        type: "boolean",
      },
    ],
  },
  {
    category: "Nursing Care",
    questions: [
      {
        id: "nurse_01",
        text: "How often did nurses treat you with courtesy and respect?",
        type: "rating",
      },
      {
        id: "nurse_02",
        text: "How often did nurses listen carefully to you?",
        type: "rating",
      },
      {
        id: "nurse_03",
        text: "After you pressed the call button, how often did you get help as soon as you wanted it?",
        type: "rating",
      },
      {
        id: "nurse_04",
        text: "How well did nurses explain your care plan in terms you understood?",
        type: "rating",
      },
      {
        id: "nurse_05",
        text: "Did nurses hand over information smoothly during shift changes?",
        type: "rating",
      },
    ],
  },
  {
    category: "Physician Care",
    questions: [
      {
        id: "phys_01",
        text: "Did the doctors treat you with courtesy and respect?",
        type: "rating",
      },
      {
        id: "phys_02",
        text: "Did the doctors listen carefully to your concerns?",
        type: "rating",
      },
      {
        id: "phys_03",
        text: "How clearly did physicians explain your medical condition and treatments?",
        type: "rating",
      },
      {
        id: "phys_04",
        text: "Were you involved in decisions about your treatment as much as you wanted?",
        type: "rating",
      },
      {
        id: "phys_05",
        text: "Did the doctors seem well-informed about your medical history?",
        type: "rating",
      },
    ],
  },
  {
    category: "Maternity & Newborn Care",
    questions: [
      {
        id: "mat_01",
        text: "Was sufficient time taken to discuss your birth plan with the care team?",
        type: "rating",
      },
      {
        id: "mat_02",
        text: "How satisfied were you with the pain relief options provided during labor?",
        type: "rating",
      },
      {
        id: "mat_03",
        text: "Were you kept well-informed about the progress of your labor and birth?",
        type: "rating",
      },
      {
        id: "mat_04",
        text: "Did you receive adequate support for feeding your baby (breastfeeding or formula)?",
        type: "rating",
      },
      {
        id: "mat_05",
        text: "Were the hospital policies regarding visitors and photos explained clearly?",
        type: "boolean",
      },
    ],
  },
  {
    category: "Radiology & Diagnostic Imaging",
    questions: [
      {
        id: "rad_01",
        text: "Did you receive enough information about what to expect during your X-ray or scan?",
        type: "rating",
      },
      {
        id: "rad_02",
        text: "Were you satisfied with the security of your belongings during your procedure?",
        type: "rating",
      },
      {
        id: "rad_03",
        text: "Did the staff member carrying out the scan introduce themselves clearly?",
        type: "boolean",
      },
      {
        id: "rad_04",
        text: "Were test results explained to you in a way you could understand?",
        type: "rating",
      },
    ],
  },
  {
    category: "Facility, Cleanliness & Safety",
    questions: [
      {
        id: "env_01",
        text: "How clean was your hospital room and bathroom?",
        type: "rating",
      },
      {
        id: "env_02",
        text: "Was the area around your room quiet at night?",
        type: "rating",
      },
      {
        id: "env_03",
        text: "Did you feel your personal privacy was respected during your stay?",
        type: "boolean",
      },
      {
        id: "env_04",
        text: "Did you see staff members wash their hands or use sanitizer before caring for you?",
        type: "boolean",
      },
      {
        id: "env_05",
        text: "Was the hospital environment calm and well-organized?",
        type: "rating",
      },
    ],
  },
  {
    category: "Medication & Pain Management",
    questions: [
      {
        id: "med_01",
        text: "Before giving you new medicine, did staff explain what it was for?",
        type: "boolean",
      },
      {
        id: "med_02",
        text: "Did staff describe possible side effects in a way you could understand?",
        type: "boolean",
      },
      {
        id: "med_03",
        text: "If you received anesthesia, were the side effects explained clearly beforehand?",
        type: "rating",
      },
      {
        id: "med_04",
        text: "How well was your pain controlled during your stay?",
        type: "rating",
      },
      {
        id: "med_05",
        text: "Did staff do everything they could to help you manage your pain safely?",
        type: "rating",
      },
    ],
  },
  {
    category: "Discharge & Transition",
    questions: [
      {
        id: "dis_01",
        text: "Did you receive clear written instructions on how to care for yourself at home?",
        type: "boolean",
      },
      {
        id: "dis_02",
        text: "Did you understand which symptoms or health problems to watch for after leaving?",
        type: "rating",
      },
      {
        id: "dis_03",
        text: "Were your follow-up appointments scheduled before you left?",
        type: "boolean",
      },
      {
        id: "dis_04",
        text: "Do you know who to contact if you have questions about your recovery?",
        type: "boolean",
      },
    ],
  },
  {
    category: "Billing & Insurance",
    questions: [
      {
        id: "bill_01",
        text: "Was the final billing statement easy to understand?",
        type: "rating",
      },
      {
        id: "bill_02",
        text: "Did our financial counselors effectively help you navigate insurance or payment options?",
        type: "rating",
      },
    ],
  },
  {
    category: "Personal & Cultural Respect",
    questions: [
      {
        id: "resp_01",
        text: "Were your cultural background or beliefs respected and valued during your visit?",
        type: "rating",
      },
      {
        id: "resp_02",
        text: "Did you feel our team showed genuine concern for your well-being?",
        type: "rating",
      },
    ],
  },
  {
    category: "Overall Satisfaction",
    questions: [
      {
        id: "ovr_01",
        text: "Using any number from 0 to 5, what number would you use to rate this hospital?",
        type: "rating",
      },
      {
        id: "ovr_02",
        text: "Would you recommend this hospital to your friends and family?",
        type: "rating",
      },
      {
        id: "ovr_03",
        text: "Is there anything else you would like to share about your experience?",
        type: "textarea",
      },
    ],
  },
];
