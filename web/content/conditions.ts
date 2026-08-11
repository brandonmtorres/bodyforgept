/* What the clinic treats, grouped the way the clinic groups it.

   Ehlers-Danlos sits under Neurological because that is where the clinic filed it.
   It is a connective-tissue disorder rather than a strictly neurological one; it was
   left where the clinic put it rather than silently re-filed. */

export const TAGS = {
  op: "After surgery",
  sp: "Sports injury",
  or: "Joint & muscle",
  ve: "Balance & dizziness",
  nu: "Neurological",
} as const;

export type TagKey = keyof typeof TAGS;

export type Condition = { name: string; tag: TagKey };

export type ConditionTab = {
  id: string;
  label: string;
  items: Condition[];
  note?: string;
};

const c = (name: string, tag: TagKey): Condition => ({ name, tag });

export const CONDITION_TABS: ConditionTab[] = [
  {
    id: "knee",
    label: "Knee",
    items: [
      c("Knee replacement", "op"),
      c("ACL, MCL or LCL surgery", "op"),
      c("ACL, MCL or LCL sprains and tears", "sp"),
      c("Meniscus and cartilage surgery", "op"),
      c("Runner's knee (kneecap pain)", "sp"),
      c("Knee arthritis and bursitis", "or"),
      c("Recovery after a broken bone", "op"),
      c("Thigh and hamstring tears", "sp"),
    ],
  },
  {
    id: "hip",
    label: "Hip & pelvis",
    items: [
      c("Hip replacement", "op"),
      c("Hip labral tears", "op"),
      c("SI joint pain (low back and pelvis)", "or"),
      c("Hip bursitis and tendon pain", "or"),
      c("Sciatica", "or"),
      c("Hip arthritis", "or"),
      c("Groin and hip strains", "sp"),
    ],
  },
  {
    id: "shd",
    label: "Shoulder & elbow",
    items: [
      c("Shoulder replacement", "op"),
      c("Rotator cuff tears and repairs", "op"),
      c("Rotator cuff pain and pinching", "sp"),
      c("Shoulder labral tears", "op"),
      c("Tennis elbow", "sp"),
      c("Golfer's elbow", "sp"),
      c("Frozen shoulder and shoulder arthritis", "or"),
    ],
  },
  {
    id: "spine",
    label: "Spine & neck",
    items: [
      c("Low back pain", "or"),
      c("Neck pain", "or"),
      c("Recovery after spinal fusion", "op"),
      c("An unstable or “giving way” back", "sp"),
      c("Sciatica and nerve pain down the leg", "or"),
      c("SI joint pain (low back and pelvis)", "or"),
      c("Desk and posture-related neck strain", "or"),
    ],
  },
  {
    id: "foot",
    label: "Foot & ankle",
    items: [
      c("Plantar fasciitis", "or"),
      c("Achilles tendonitis", "sp"),
      c("Ankle sprains and strains", "sp"),
      c("Recovery after a broken bone", "op"),
      c("Calf and achilles tears", "op"),
      c("Foot and ankle arthritis", "or"),
    ],
  },
  {
    id: "bal",
    label: "Balance & bone health",
    items: [
      c("Vertigo and spinning sensations (BPPV)", "ve"),
      c("Inner-ear balance problems", "ve"),
      c("Unsteadiness and fear of falling", "ve"),
      c("Balance after a stroke or head injury", "ve"),
      c("Osteoporosis and thinning bones", "or"),
      c("Arthritis in more than one joint", "or"),
    ],
  },
  {
    id: "neuro",
    label: "Neurological",
    items: [
      c("Parkinson's disease", "nu"),
      c("Foot drop", "nu"),
      c("Ehlers-Danlos syndrome", "nu"),
    ],
    note: "Neurological care here is about gait, balance, joint control and the strength to keep moving safely day to day. Sessions are one-to-one, and the plan is rebuilt as the condition changes rather than run to a fixed number of visits.",
  },
];
