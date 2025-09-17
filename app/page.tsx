"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { RotateCcw, Calculator, AlertCircle } from "lucide-react"

const diseaseOptions = {
  neonatal_general: "신생아 일반 감염",
  neonatal_otitis: "신생아 급성 중이염",
  neonatal_uti_prophylaxis: "신생아 요로감염 예방",
  pediatric_mild: "소아 경증/중등도 감염",
  pediatric_severe: "소아 중증 감염",
  pediatric_otitis: "소아 급성 중이염",
}

const antibiotics = {
  amoxicillin: {
    name: "아목시실린 (Amoxicillin)",
    brandName: (
      <>
        파목신<sup>®</sup> (Pamoxin<sup>®</sup>)
      </>
    ),
    hasDiseaseDosing: true, // Flag to enable disease selection
    dosageByDisease: {
      neonatal_general: {
        standard: 12.5, // 25mg/kg/day divided by 2
        frequency: 2,
        maxSingleDose: 500,
        interval: "12시간",
        description: "20-30mg/kg/일, 12시간 간격",
      },
      neonatal_otitis: {
        standard: 13.33, // 40mg/kg/day divided by 3
        frequency: 3,
        maxSingleDose: 500,
        interval: "8시간",
        description: "30-40mg/kg/일, 8시간 간격",
      },
      neonatal_uti_prophylaxis: {
        standard: 12.5, // 12.5mg/kg/day once daily
        frequency: 1,
        maxSingleDose: 500,
        interval: "24시간",
        description: "10-15mg/kg/일, 24시간 간격",
      },
      pediatric_mild: {
        standard: 12.5, // 37.5mg/kg/day divided by 3
        frequency: 3,
        maxSingleDose: 500,
        interval: "8시간",
        description: "25-50mg/kg/일, 8시간 간격",
      },
      pediatric_severe: {
        standard: 42.5, // 85mg/kg/day divided by 2
        frequency: 2,
        maxSingleDose: 2000,
        interval: "12시간",
        description: "80-90mg/kg/일, 12시간 간격",
      },
      pediatric_otitis: {
        standard: 42.5, // 85mg/kg/day divided by 2
        frequency: 2,
        maxSingleDose: 2000,
        interval: "12시간",
        description: "80-90mg/kg/일, 12시간 간격",
      },
    },
    dosage: {
      standard: 16.67,
      frequency: 3,
      maxSingleDose: 500,
      minAge: 1,
      interval: "8시간",
    },
    formulations: [
      {
        type: "suspension",
        name: "파목신시럽",
        concentrations: [
          {
            label: "25mg/mL",
            value: 25,
            description: "아목시실린 25mg/mL",
          },
        ],
      },
      {
        type: "capsule",
        name: "파목신캡슐",
        concentrations: [
          {
            label: "250mg/캡슐",
            value: 250,
            unit: "캡슐",
            description: "아목시실린 250mg",
          },
          {
            label: "500mg/캡슐",
            value: 500,
            unit: "캡슐",
            description: "아목시실린 500mg",
          },
        ],
      },
    ],
    info: {
      indications: "연쇄구균 감염, 폐렴구균 감염, 급성 중이염, 부비동염",
      precautions: "페니실린 알레르기 환자에게 투여 금지. 위장관 부작용 가능성.",
      storage: "조제 후 반드시 냉장 보관하고 7일 이내에 사용해야 합니다.",
    },
  },
  cefpodoxime: {
    name: "세프포독심 (Cefpodoxime)",
    brandName: (
      <>
        바난<sup>®</sup> (Banan<sup>®</sup>)
      </>
    ),
    dosage: {
      standard: 5, // mg/kg/dose
      frequency: 2, // times per day
      maxSingleDose: 200, // mg
      minAge: 2, // months
      interval: "12시간",
    },
    formulations: [
      {
        type: "suspension",
        name: "바난건조시럽",
        concentrations: [{ label: "10mg/mL", value: 10 }],
      },
      {
        type: "tablet",
        name: "바난정",
        concentrations: [{ label: "100mg/정", value: 100, unit: "정" }],
      },
    ],
    info: {
      indications: "상기도감염, 중이염, 요로감염",
      precautions: "페니실린 계열 항생제에 알레르기 반응이 있는 경우 주의가 필요합니다.",
      storage: "조제된 시럽은 냉장 보관하고 14일 이내에 사용해야 합니다.",
    },
  },
  amoxicillin_clavulanate: {
    name: "아목시실린/클라불란산 (Amoxicillin/Clavulanate)",
    brandName: (
      <>
        아모크라<sup>®</sup> (Amocra<sup>®</sup>)
      </>
    ),
    dosage: {
      standard: 22.5, // mg/kg/dose (based on amoxicillin component)
      frequency: 2, // times per day
      maxSingleDose: 875, // mg (amoxicillin basis for 7:1 ratio)
      minAge: 3, // months
      interval: "12시간",
      neoSyrup: {
        standard: 45, // mg/kg/dose (90mg/kg/day divided by 2)
        frequency: 2,
        maxSingleDose: 1000, // mg (amoxicillin basis for 14:1 ratio)
        interval: "12시간",
      },
    },
    formulations: [
      {
        type: "suspension",
        name: "아모크라건조시럽",
        concentrations: [
          {
            label: "듀오 (7:1시럽)",
            value: 45.7, // amoxicillin 40mg + clavulanate 5.7mg per mL
            description: "아목시실린 40mg + 클라불란산 5.7mg/mL",
          },
          {
            label: "네오 (14:1시럽)",
            value: 120, // amoxicillin 120mg per mL (600mg/5mL)
            description: "아목시실린 120mg + 클라불란산 8.58mg/mL",
            isNeoSyrup: true,
          },
        ],
      },
      {
        type: "tablet",
        name: "아모크라정",
        concentrations: [
          {
            label: "187.5mg/정 (2:1)", // 비율 추가
            value: 187.5,
            unit: "정",
            description: "아목시실린 125mg + 클라불란산 62.5mg",
          },
          {
            label: "375mg/정 (2:1)", // 비율 추가
            value: 375,
            unit: "정",
            description: "아목시실린 250mg + 클라불란산 125mg",
          },
          {
            label: "625mg/정 (4:1)", // 비율 추가
            value: 625,
            unit: "정",
            description: "아목시실린 500mg + 클라불란산 125mg",
          },
        ],
      },
      {
        type: "tablet",
        name: "아모크라듀오정",
        concentrations: [
          {
            label: "500mg/정 (7:1)", // 비율 추가
            value: 500,
            unit: "정",
            description: "아목시실린 437.5mg + 클라불란산 62.5mg",
          },
          {
            label: "1000mg/정 (7:1)", // 비율 추가
            value: 1000,
            unit: "정",
            description: "아목시실린 875mg + 클라불란산 125mg",
          },
        ],
      },
    ],
    info: {
      indications: "급성 중이염, 부비동염, 폐렴, 요로감염",
      precautions: "페니실린 알레르기 환자에게 투여 금지. 간 기능 이상 시 주의. 클라불란산으로 인한 설사 가능성.",
      storage: "조제 후 반드시 냉장 보관하고 7일 이내에 사용해야 합니다.",
    },
  },
  azithromycin: {
    name: "아지스로마이신 (Azithromycin)",
    brandName: (
      <>
        지스로맥스<sup>®</sup> (Zithromax<sup>®</sup>)
      </>
    ),
    dosage: {
      regimen3day: {
        standard: 10, // mg/kg/dose
        frequency: 1, // once daily
        days: 3,
        maxSingleDose: 500, // mg
        interval: "24시간",
      },
      regimen5day: {
        day1: 10, // mg/kg/dose for day 1
        day2to5: 5, // mg/kg/dose for days 2-5
        frequency: 1, // once daily
        days: 5,
        maxSingleDose: 500, // mg
        interval: "24시간",
      },
      minAge: 6, // months
    },
    formulations: [
      {
        type: "suspension",
        name: "지스로맥스건조시럽",
        concentrations: [{ label: "40mg/mL", value: 40 }],
      },
      {
        type: "tablet",
        name: "지스로맥스정",
        concentrations: [{ label: "250mg/정", value: 250, unit: "정" }],
      },
    ],
    info: {
      indications: "지역사회획득 폐렴, 인두 편도염, 급성 중이염",
      precautions: "심장 QT 간격 연장 환자 주의. 다른 마크로라이드 계열 약물과 교차 알레르기 가능성.",
      storage: "조제 후 실온 보관하며 10일 이내에 사용합니다.",
    },
  },
  cefadroxil: {
    name: "세파드록실 (Cefadroxil)",
    brandName: (
      <>
        듀리세프<sup>®</sup> (Duricef<sup>®</sup>)
      </>
    ),
    dosage: {
      standard: 15, // mg/kg/dose (30mg/kg/day divided by 2)
      frequency: 2, // times per day
      maxSingleDose: 1000, // mg (max 2g/day for UTI, 1g/day for other infections)
      minAge: 1, // months
      interval: "12시간",
    },
    formulations: [
      {
        type: "suspension",
        name: "듀리세프건조시럽",
        concentrations: [{ label: "50mg/mL", value: 50 }],
      },
      {
        type: "capsule",
        name: "듀리세프캡슐",
        concentrations: [{ label: "250mg/캡슐", value: 250, unit: "캡슐" }],
      },
    ],
    info: {
      indications: "인두편도염, 피부 및 연조직 감염, 요로감염, 농가진",
      precautions:
        "페니실린 계열 항생제에 알레르기 반응이 있는 경우 주의가 필요합니다. 신기능 장애 시 용량 조절이 필요할 수 있습니다.",
      storage: "조제된 시럽은 냉장 보관하고 14일 이내에 사용해야 합니다.",
    },
  },
  clarithromycin: {
    name: "클라리스로마이신 (Clarithromycin)",
    brandName: (
      <>
        클래신<sup>®</sup> (Clasin<sup>®</sup>)
      </>
    ),
    dosage: {
      standard: 7.5, // mg/kg/dose (15mg/kg/day divided by 2)
      frequency: 2, // times per day
      maxSingleDose: 500, // mg
      minAge: 6, // months
      interval: "12시간",
    },
    formulations: [
      {
        type: "suspension",
        name: "클래신건조시럽",
        concentrations: [
          { label: "25mg/mL", value: 25 },
          { label: "50mg/mL", value: 50 },
        ],
      },
      {
        type: "tablet",
        name: "클래신정",
        concentrations: [
          { label: "250mg/정", value: 250, unit: "정" },
          { label: "500mg/정", value: 500, unit: "정" },
        ],
      },
    ],
    info: {
      indications: "인두편도염, 부비동염, 폐렴, 중이염, 피부 및 연조직 감염",
      precautions:
        "마크로라이드 계열 항생제에 알레르기 반응이 있는 경우 주의가 필요합니다. 심장 QT 간격 연장 환자 주의. 간기능 장애 시 용량 조절이 필요할 수 있습니다.",
      storage: "조제된 시럽은 냉장 보관하고 14일 이내에 사용해야 합니다.",
    },
  },
  cefixime: {
    name: "세픽심 (Cefixime)",
    brandName: (
      <>
        슈프락스<sup>®</sup> (Suprax<sup>®</sup>)
      </>
    ),
    dosage: {
      standard: 3, // mg/kg/dose (6mg/kg/day divided by 2)
      frequency: 2, // times per day
      maxSingleDose: 200, // mg
      minAge: 6, // months
      interval: "12시간",
    },
    formulations: [
      {
        type: "suspension",
        name: "슈프락스산", // 제품명을 슈프락스산으로 수정
        concentrations: [{ label: "50mg/g", value: 50 }], // 농도를 50mg/g로 수정
      },
      {
        type: "capsule", // tablet에서 capsule로 변경
        name: "슈프락스캡슐", // 제품명을 슈프락스캡슐로 수정
        concentrations: [{ label: "100mg/캡슐", value: 100, unit: "캡슐" }], // 단위를 캡슐로 수정
      },
    ],
    info: {
      indications: "급성 중이염, 인두편도염, 급성 기관지염, 요로감염",
      precautions:
        "페니실린 계열 항생제에 알레르기 반응이 있는 경우 주의가 필요합니다. 신기능 장애 시 용량 조절이 필요할 수 있습니다.",
      storage: "조제된 시럽은 냉장 보관하고 14일 이내에 사용해야 합니다.",
    },
  },
  cefdinir: {
    name: "세프디니르 (Cefdinir)",
    brandName: (
      <>
        옴니세프<sup>®</sup> (Omnicef<sup>®</sup>)
      </>
    ),
    dosage: {
      standard: 6, // mg/kg/dose (18mg/kg/day divided by 3)
      frequency: 3, // times per day
      maxSingleDose: 200, // mg (600mg/day max divided by 3)
      minAge: 6, // months
      interval: "8시간", // Changed interval to 8 hours for 3 times daily
    },
    formulations: [
      {
        type: "suspension",
        name: "옴니세프세립",
        concentrations: [{ label: "100mg/g", value: 100 }],
      },
      {
        type: "capsule",
        name: "옴니세프캡슐",
        concentrations: [{ label: "100mg/캡슐", value: 100, unit: "캡슐" }],
      },
    ],
    info: {
      indications: "급성 중이염, 인두편도염, 부비동염, 지역사회획득 폐렴, 피부 및 연조직 감염",
      precautions:
        "페니실린 계열 항생제에 알레르기 반응이 있는 경우 주의가 필요합니다. 철분 보충제와 함께 복용 시 흡수가 감소할 수 있습니다.",
      storage: "조제된 시럽은 냉장 보관하고 10일 이내에 사용해야 합니다.",
    },
  },
  cefditoren: {
    name: "세프디토렌 (Cefditoren)",
    brandName: (
      <>
        메이액트<sup>®</sup> (Meiact<sup>®</sup>)
      </>
    ),
    dosage: {
      standard: 3, // mg/kg/dose (9mg/kg/day divided by 3)
      frequency: 3, // times per day
      maxSingleDose: 200, // mg
      minAge: 6, // months
      interval: "8시간",
    },
    formulations: [
      {
        type: "suspension",
        name: "메이액트세립",
        concentrations: [{ label: "10mg/mL", value: 10 }],
      },
      {
        type: "tablet",
        name: "메이액트정",
        concentrations: [{ label: "100mg/정", value: 100 }],
      },
    ],
    info: {
      indications: "급성 중이염, 인두편도염, 부비동염, 지역사회획득 폐렴",
      precautions: "페니실린 계열 항생제에 알레르기 반응이 있는 경우 주의가 필요합니다.",
      storage: "조제된 시럽은 냉장 보관하고 14일 이내에 사용해야 합니다.",
    },
  },
  cefcapene: {
    name: "세프카펜 (Cefcapene)",
    brandName: (
      <>
        후로목스<sup>®</sup> (Furomox<sup>®</sup>)
      </>
    ),
    dosage: {
      standard: 3, // mg/kg/dose (9mg/kg/day divided by 3)
      frequency: 3, // times per day
      maxSingleDose: 150, // mg
      minAge: 6, // months
      interval: "8시간",
    },
    formulations: [
      {
        type: "suspension",
        name: "후로목스세립",
        concentrations: [{ label: "10mg/mL", value: 10 }],
      },
      {
        type: "tablet",
        name: "후로목스정",
        concentrations: [{ label: "100mg/정", value: 100 }],
      },
    ],
    info: {
      indications: "급성 중이염, 인두편도염, 부비동염, 지역사회획득 폐렴",
      precautions: "페니실린 계열 항생제에 알레르기 반응이 있는 경우 주의가 필요합니다.",
      storage: "조제된 시럽은 냉장 보관하고 14일 이내에 사용해야 합니다.",
    },
  },
  cefaclor: {
    name: "세파클러 (Cefaclor)",
    brandName: (
      <>
        시클러<sup>®</sup> (Ceclor<sup>®</sup>)
      </>
    ),
    dosage: {
      standard: 6.7, // mg/kg/dose (20mg/kg/day divided by 3)
      frequency: 3, // times per day
      maxSingleDose: 500, // mg
      minAge: 1, // months
      interval: "8시간",
    },
    formulations: [
      {
        type: "suspension",
        name: "시클러건조시럽",
        concentrations: [{ label: "25mg/mL", value: 25 }],
      },
      {
        type: "tablet",
        name: "시클러정",
        concentrations: [{ label: "250mg/정", value: 250, unit: "정" }],
      },
    ],
    info: {
      indications: "급성 중이염, 인두편도염, 부비동염, 요로감염, 피부 및 연조직 감염",
      precautions: "세팔로스포린계 항생제 과민반응 시 금기. 페니실린 알레르기 병력 시 신중 투여.",
      storage: "조제된 시럽은 냉장 보관하고 14일 이내에 사용해야 합니다.",
    },
  },
  tmp_smx: {
    name: "트리메토프림/설파메톡사졸 (TMP/SMX)",
    brandName: (
      <>
        셉트린<sup>®</sup> (Septrin<sup>®</sup>)
      </>
    ),
    dosage: {
      standard: 4, // mg/kg/dose of TMP (8mg/kg/day TMP divided by 2)
      frequency: 2, // times per day
      maxSingleDose: 160, // mg TMP (equivalent to 2 tablets)
      minAge: 2, // months
      interval: "12시간",
    },
    formulations: [
      {
        type: "tablet",
        name: "셉트린정",
        concentrations: [
          {
            label: "TMP 80mg + SMX 400mg/정",
            value: 80, // TMP content for calculation
            unit: "정",
            description: "트리메토프림 80mg + 설파메톡사졸 400mg",
          },
        ],
      },
    ],
    info: {
      indications: "요로감염, 중이염, 폐포자충 폐렴 예방, 세균성 설사",
      precautions: "설폰아미드계 약물 과민반응 시 금기. G6PD 결핍 환자 주의. 2개월 미만 금기.",
      storage: "실온 보관.",
    },
  },
  roxithromycin: {
    name: "록시스로마이신 (Roxithromycin)",
    brandName: (
      <>
        록씨<sup>®</sup> (Roxithromycin<sup>®</sup>)
      </>
    ),
    dosage: {
      standard: 4, // mg/kg/dose (8mg/kg/day divided by 2)
      frequency: 2, // times per day
      maxSingleDose: 300, // mg
      minAge: 6, // months
      interval: "12시간",
    },
    formulations: [
      {
        type: "suspension",
        name: "록씨현탁액",
        concentrations: [{ label: "10mg/mL", value: 10 }],
      },
      {
        type: "tablet",
        name: "루리드정",
        concentrations: [{ label: "150mg/정", value: 150, unit: "정" }],
      },
    ],
    info: {
      indications: "인두편도염, 부비동염, 폐렴, 중이염, 피부 및 연조직 감염",
      precautions:
        "마크로라이드 계열 항생제에 알레르기 반응이 있는 경우 주의가 필요합니다. 심장 QT 간격 연장 환자 주의.",
      storage: "조제된 현탁액은 냉장 보관하고 14일 이내에 사용해야 합니다.",
    },
  },
  clindamycin: {
    name: "클린다마이신 (Clindamycin)",
    brandName: (
      <>
        훌그램<sup>®</sup> (Fullgram<sup>®</sup>)
      </>
    ),
    dosage: {
      standard: 4, // mg/kg/dose (12mg/kg/day divided by 3)
      frequency: 3, // times per day
      maxSingleDose: 300, // mg
      minAge: 1, // months
      interval: "8시간",
    },
    formulations: [
      {
        type: "capsule",
        name: "훌그램캡슐",
        concentrations: [{ label: "150mg/캡슐", value: 150, unit: "정" }],
      },
    ],
    info: {
      indications: "혐기성 세균 감염, 피부 및 연조직 감염, 골수염",
      precautions: "위막성 대장염 위험. 설사 발생 시 즉시 중단. 간기능 장애 시 용량 조절 필요.",
      storage: "실온 보관.",
    },
  },
  cefprozil: {
    name: "세프프로질 (Cefprozil)",
    brandName: (
      <>
        투세프<sup>®</sup> (Cefzil<sup>®</sup>)
      </>
    ),
    dosage: {
      standard: 11.25, // mg/kg/dose (22.5mg/kg/day divided by 2)
      frequency: 2, // times per day
      maxSingleDose: 500, // mg
      minAge: 6, // months
      interval: "12시간",
    },
    formulations: [
      {
        type: "suspension",
        name: "투세프건조시럽",
        concentrations: [{ label: "25mg/mL", value: 25 }],
      },
      {
        type: "tablet",
        name: "투세프정",
        concentrations: [{ label: "250mg/정", value: 250, unit: "정" }],
      },
    ],
    info: {
      indications: "급성 중이염, 인두편도염, 부비동염, 피부 및 연조직 감염",
      precautions: "페니실린 계열 항생제에 알레르기 반응이 있는 경우 주의가 필요합니다.",
      storage: "조제된 시럽은 냉장 보관하고 14일 이내에 사용해야 합니다.",
    },
  },
  doxycycline: {
    name: "독시사이클린 (Doxycycline)",
    brandName: (
      <>
        모노신<sup>®</sup> (Monocin<sup>®</sup>)
      </>
    ),
    dosage: {
      standard: 2, // mg/kg/dose (2mg/kg/회, 12시간 간격)
      frequency: 2, // times per day
      maxSingleDose: 100, // mg (최대 200mg/일)
      minAge: 96, // months (8 years) - 치아 착색 위험으로 8세 이상 권장
      interval: "12시간",
      mrmpException: true, // 마크로라이드 불응성 마이코플라스마 폐렴에서 예외적 사용
    },
    formulations: [
      {
        type: "tablet",
        name: "모노신정",
        concentrations: [{ label: "100mg/정", value: 100, unit: "정" }],
      },
    ],
    info: {
      indications: "마크로라이드 불응성 마이코플라스마 폐렴 (MRMP), 리케치아 감염",
      precautions:
        "8세 미만에서는 허가사항 중 사용상의 주의사항을 고려하여 독시사이클린 치료로 인한 임상적 이득이 위해를 초과하는 것으로 판단되는 경우에 한하여 사용하며, 치아착색 등 이상반응에 대하여 환자(보호자)에게 충분히 설명 및 동의 후 사용한다. 테트라사이클린제의 흡수를 방해할 수 있는 약물, 유제품 식이 전·후 2시간 이상 간격을 두고 복용한다. 광과민성 반응 주의.",
      storage: "실온 보관, 직사광선 피함.",
    },
  },
  minocycline: {
    name: "미노사이클린 (Minocycline)",
    brandName: (
      <>
        미노씬<sup>®</sup> (Minocin<sup>®</sup>)
      </>
    ),
    dosage: {
      standard: 2, // mg/kg/dose (2mg/kg/회, 12시간 간격)
      frequency: 2, // times per day
      maxSingleDose: 100, // mg (최대 200mg/일)
      minAge: 96, // months (8 years) - 치아 착색 위험으로 8세 이상 권장
      interval: "12시간",
      mrmpException: true, // 마크로라이드 불응성 마이코플라스마 폐렴에서 예외적 사용
    },
    formulations: [
      {
        type: "capsule",
        name: "미노씬캡슐",
        concentrations: [{ label: "50mg/캡슐", value: 50, unit: "캡슐" }],
      },
    ],
    info: {
      indications: "마크로라이드 불응성 마이코플라스마 폐렴 (MRMP), 여드름",
      precautions:
        "독시사이클린 사용이 어려운 경우에 사용한다. 8세 미만에서는 허가사항 중 사용상의 주의사항을 고려하여 미노사이클린 치료로 인한 임상적 이득이 위해를 초과하는 것으로 판단되는 경우에 한하여 사용하며, 치아착색 등 이상반응에 대하여 환자(보호자)에게 충분히 설명 및 동의 후 사용한다. 테트라사이클린제의 흡수를 방해할 수 있는 약물, 유제품 식이 전·후 2시간 이상 간격을 두고 복용한다. 광과민성 반응 주의.",
      storage: "실온 보관, 직사광선 피함.",
    },
  },
  levofloxacin: {
    name: "레보플록사신 (Levofloxacin)",
    brandName: (
      <>
        크라비트<sup>®</sup> (Cravit<sup>®</sup>)
      </>
    ),
    dosage: {
      standard: 9, // mg/kg/dose (8-10mg/kg/회)
      frequency: 2, // times per day for <5 years, 1 for ≥5 years
      maxSingleDose: 750, // mg (최대 750mg/일)
      minAge: 216, // months (18 years) - 관절 연골 손상 위험으로 18세 이상 권장
      interval: "12시간 (5세 미만) 또는 24시간 (5세 이상)",
      mrmpException: true, // 마크로라이드 불응성 마이코플라스마 폐렴에서 예외적 사용
      ageBasedFrequency: true, // Added flag for age-based frequency calculation
    },
    formulations: [
      {
        type: "tablet",
        name: "크라비트정",
        concentrations: [
          { label: "100mg/정", value: 100, unit: "정" },
          { label: "250mg/정", value: 250, unit: "정" },
          { label: "500mg/정", value: 500, unit: "정" },
        ],
      },
    ],
    info: {
      indications: "마크로라이드 불응성 마이코플라스마 폐렴 (MRMP), 중증 세균성 감염",
      precautions:
        "독시사이클린(또는 미노사이클린) 경구 투여가 불가능하거나, 약물 이상반응이 있는 경우, 환자의 전신 상태가 불량한 경우 사용한다. 18세 이하에서는 허가사항 중 사용상의 주의사항을 고려하여 치료로 인한 임상적 이득이 위해를 초과하는 것으로 판단되는 경우에 한하여 사용하며, 근골격계를 포함한 이상반응에 대하여 환자(보호자)에게 충분히 설명 및 동의 후 사용한다. 레보플록사신과 domperidone, hydroxyzine 병용을 금지한다. 퀴놀론제의 흡수를 방해할 수 있는 약물, 유제품 식이 전·후 2시간 이상 간격을 두고 복용한다.",
      storage: "실온 보관, 습기 피함.",
    },
  },
  tosufloxacin: {
    name: "토수플록사신 (Tosufloxacin)",
    brandName: (
      <>
        오젝스<sup>®</sup> (Ozex<sup>®</sup>)
      </>
    ),
    dosage: {
      standard: 6, // mg/kg/dose
      frequency: 2, // times per day
      maxSingleDose: 180, // mg (360mg/일 ÷ 2회)
      minAge: 216, // months (18 years) - 관절 연골 손상 위험으로 18세 이상 권장
      interval: "12시간",
      mrmpException: true, // 마크로라이드 불응성 마이코플라스마 폐렴에서 예외적 사용
    },
    formulations: [
      {
        type: "tablet",
        name: "오젝스정",
        concentrations: [{ label: "150mg/정", value: 150, unit: "정" }],
      },
    ],
    info: {
      indications: "마크로라이드 불응성 마이코플라스마 폐렴 (MRMP), 중증 세균성 감염",
      precautions:
        "독시사이클린(또는 미노사이클린) 경구 투여가 불가능하거나, 약물 이상반응이 있는 경우, 환자의 전신 상태가 불량한 경우 사용한다. 18세 이하에서는 허가사항 중 사용상의 주의사항을 고려하여 치료로 인한 임상적 이득이 위해를 초과하는 것으로 판단되는 경우에 한하여 사용하며, 근골격계를 포함한 이상반응에 대하여 환자(보호자)에게 충분히 설명 및 동의 후 사용한다. 퀴놀론제의 흡수를 방해할 수 있는 약물, 유제품 식이 전·후 2시간 이상 간격을 두고 복용한다.",
      storage: "실온 보관, 습기 피함.",
    },
  },
}

const categories = {
  penicillin: {
    name: "페니실린계",
    antibiotics: ["amoxicillin", "amoxicillin_clavulanate"],
  },
  cephalosporin_1st: {
    name: "세팔로스포린계 1세대",
    antibiotics: ["cefadroxil"],
  },
  cephalosporin_2nd: {
    name: "세팔로스포린계 2세대",
    antibiotics: ["cefaclor", "cefprozil"],
  },
  cephalosporin_3rd: {
    name: "세팔로스포린계 3세대",
    antibiotics: ["cefpodoxime", "cefixime", "cefdinir", "cefditoren", "cefcapene"],
  },
  macrolide: {
    name: "마크로라이드계",
    antibiotics: ["azithromycin", "clarithromycin", "roxithromycin"],
  },
  lincosamide: {
    name: "린코사마이드계",
    antibiotics: ["clindamycin"],
  },
  sulfonamide: {
    name: "설폰아미드계",
    antibiotics: ["tmp_smx"],
  },
  tetracycline: {
    name: "테트라사이클린계",
    antibiotics: ["doxycycline", "minocycline"],
  },
  fluoroquinolone: {
    name: "플루오로퀴놀론계",
    antibiotics: ["levofloxacin", "tosufloxacin"],
  },
}

type AntibioticKey = keyof typeof antibiotics

interface CalculationResults {
  singleDose: number
  volume?: number
  tablets?: { amount: number; fraction: string }
  totalDailyDose: number
  totalDailyVolume?: number
  totalDailyTablets?: { amount: number; fraction: string }
  frequency: number
  interval: string
  isAzithromycin: boolean
  azithromycinRegimen?: string
  day1Dose?: number
  day1Volume?: number
  day1Tablets?: { amount: number; fraction: string }
  day2to5Dose?: number
  day2to5Volume?: number
  day2to5Tablets?: { amount: number; fraction: string }
  formationType: string
  warningMessage?: string
}

const formatNumber = (num: number, isVolume = false) => {
  if (isVolume) {
    // For volumes (mL, tablets, capsules), show up to 2 decimal places but remove trailing zeros
    return Number.parseFloat(num.toFixed(2)).toString()
  } else {
    // For doses (mg), round to nearest integer
    return Math.round(num).toString()
  }
}

const calculateTabletFraction = (dose: number, tabletStrength: number, formationType: string, unit?: string) => {
  const tablets = dose / tabletStrength
  const roundedTablets = Math.round(tablets * 100) / 100 // 소수점 둘째 자리까지 반올림

  const displayUnit = unit || (formationType === "capsule" ? "캡슐" : "정")

  return {
    amount: roundedTablets,
    fraction: `${formatNumber(roundedTablets, true)}${displayUnit}`,
  }
}

export default function PediatricAntibioticCalculator() {
  const [age, setAge] = useState("")
  const [ageUnit, setAgeUnit] = useState<"months" | "년">("년")
  const [weight, setWeight] = useState("")
  const [selectedAntibiotic, setSelectedAntibiotic] = useState<AntibioticKey | "">("")
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [selectedFormulation, setSelectedFormulation] = useState("")
  const [selectedConcentration, setSelectedConcentration] = useState("")
  const [selectedRegimen, setSelectedRegimen] = useState("")
  const [showAntibiotics, setShowAntibiotics] = useState(false)
  const [results, setResults] = useState<CalculationResults | null>(null)
  const [error, setError] = useState("")
  const [selectedDisease, setSelectedDisease] = useState("")

  useEffect(() => {
    if (selectedAntibiotic) {
      const antibiotic = antibiotics[selectedAntibiotic]
      if (antibiotic.formulations.length > 0) {
        setSelectedFormulation("0") // 첫 번째 제형 선택
      }
    } else {
      setSelectedFormulation("")
    }
    setSelectedConcentration("")
    setSelectedRegimen("")
  }, [selectedAntibiotic])

  useEffect(() => {
    if (selectedAntibiotic && selectedFormulation !== "") {
      const antibiotic = antibiotics[selectedAntibiotic]
      const formulation = antibiotic.formulations[Number.parseInt(selectedFormulation)]

      if (formulation && formulation.concentrations.length === 1) {
        setSelectedConcentration(formulation.concentrations[0].value.toString())
      } else {
        setSelectedConcentration("")
      }
    }
  }, [selectedAntibiotic, selectedFormulation])

  const handleCalculate = () => {
    if (!age || !weight || !selectedAntibiotic || selectedFormulation === "" || !selectedConcentration) {
      setError("모든 필드를 입력해주세요.")
      return
    }

    setError("")
    setResults(null)

    // 입력값 검증
    if (!age || !weight || !selectedAntibiotic || selectedFormulation === "" || !selectedConcentration) {
      setError("모든 필드를 입력해주세요.")
      return
    }

    if (selectedAntibiotic === "azithromycin" && !selectedRegimen) {
      setError("아지스로마이신 요법을 선택해주세요.")
      return
    }

    const ageValue = Number.parseFloat(age)
    const weightValue = Number.parseFloat(weight)
    const concentrationValue = Number.parseFloat(selectedConcentration)

    if (ageValue <= 0 || weightValue <= 0) {
      setError("나이와 체중은 0보다 큰 값을 입력해주세요.")
      return
    }

    const ageInMonths = ageUnit === "년" ? ageValue * 12 : ageValue

    const antibiotic = antibiotics[selectedAntibiotic]
    const formulation = antibiotic.formulations[Number.parseInt(selectedFormulation)]

    let warningMessage = ""
    if (ageInMonths < antibiotic.dosage.minAge && !antibiotic.dosage.mrmpException) {
      setError(`${antibiotic.name}은(는) ${antibiotic.dosage.minAge}개월 이상의 환아에게만 사용할 수 있습니다.`)
      return
    }

    if (ageInMonths < antibiotic.dosage.minAge && antibiotic.dosage.mrmpException) {
      warningMessage = `⚠️ ${antibiotic.name}은(는) 일반적으로 ${Math.floor(antibiotic.dosage.minAge / 12)}세 이상에서 사용하나, 마크로라이드 불응성 중증 마이코플라스마 폐렴에서는 예외적으로 사용 가능합니다. 보호자 동의 및 충분한 설명 후 사용하세요.`
    }

    if (selectedAntibiotic === "azithromycin") {
      const regimen = selectedRegimen === "3day" ? antibiotic.dosage.regimen3day : antibiotic.dosage.regimen5day

      if (selectedRegimen === "3day") {
        let calculatedDose = weightValue * regimen.standard
        if (calculatedDose > regimen.maxSingleDose) {
          calculatedDose = regimen.maxSingleDose
        }

        const totalDailyDose = calculatedDose * regimen.frequency

        if (formulation.type === "suspension") {
          const volume = Math.round((calculatedDose / concentrationValue) * 10) / 10
          const totalDailyVolume = Math.round((totalDailyDose / concentrationValue) * 10) / 10

          setResults({
            singleDose: Math.round(calculatedDose),
            volume: Number.parseFloat(volume.toFixed(2)),
            totalDailyDose: Math.round(totalDailyDose),
            totalDailyVolume: Number.parseFloat(totalDailyVolume.toFixed(2)),
            frequency: regimen.frequency,
            interval: regimen.interval,
            isAzithromycin: true,
            azithromycinRegimen: "3일요법",
            formationType: "suspension",
            warningMessage,
          })
        } else {
          const selectedConcentrationData = formulation.concentrations.find(
            (c) => c.value.toString() === selectedConcentration,
          )
          const tablets = calculateTabletFraction(
            calculatedDose,
            concentrationValue,
            formulation.type,
            selectedConcentrationData?.unit,
          )
          const totalDailyTablets = calculateTabletFraction(
            totalDailyDose,
            concentrationValue,
            formulation.type,
            selectedConcentrationData?.unit,
          )

          setResults({
            singleDose: Math.round(calculatedDose),
            tablets,
            totalDailyDose: Math.round(totalDailyDose),
            totalDailyTablets,
            frequency: regimen.frequency,
            interval: regimen.interval,
            isAzithromycin: true,
            azithromycinRegimen: "3일요법",
            formationType: formulation.type,
            warningMessage,
          })
        }
      } else {
        let day1Dose = weightValue * antibiotic.dosage.regimen5day.day1
        let day2to5Dose = weightValue * antibiotic.dosage.regimen5day.day2to5

        if (day1Dose > antibiotic.dosage.regimen5day.maxSingleDose) {
          day1Dose = antibiotic.dosage.regimen5day.maxSingleDose
        }
        if (day2to5Dose > antibiotic.dosage.regimen5day.maxSingleDose) {
          day2to5Dose = antibiotic.dosage.regimen5day.maxSingleDose
        }

        if (formulation.type === "suspension") {
          const day1Volume = Math.round((day1Dose / concentrationValue) * 10) / 10
          const day2to5Volume = Math.round((day2to5Dose / concentrationValue) * 10) / 10

          setResults({
            singleDose: Math.round(day1Dose),
            volume: Number.parseFloat(day1Volume.toFixed(2)),
            totalDailyDose: Math.round(day1Dose),
            totalDailyVolume: Number.parseFloat(day1Volume.toFixed(2)),
            frequency: antibiotic.dosage.regimen5day.frequency,
            interval: antibiotic.dosage.regimen5day.interval,
            isAzithromycin: true,
            azithromycinRegimen: "5일요법",
            day1Dose: Math.round(day1Dose),
            day1Volume: Number.parseFloat(day1Volume.toFixed(2)),
            day2to5Dose: Math.round(day2to5Dose),
            day2to5Volume: Number.parseFloat(day2to5Volume.toFixed(2)),
            formationType: "suspension",
            warningMessage,
          })
        } else {
          const selectedConcentrationData = formulation.concentrations.find(
            (c) => c.value.toString() === selectedConcentration,
          )
          const day1Tablets = calculateTabletFraction(
            day1Dose,
            concentrationValue,
            formulation.type,
            selectedConcentrationData?.unit,
          )
          const day2to5Tablets = calculateTabletFraction(
            day2to5Dose,
            concentrationValue,
            formulation.type,
            selectedConcentrationData?.unit,
          )

          setResults({
            singleDose: Math.round(day1Dose),
            tablets: day1Tablets,
            totalDailyDose: Math.round(day1Dose),
            totalDailyTablets: day1Tablets,
            frequency: antibiotic.dosage.regimen5day.frequency,
            interval: antibiotic.dosage.regimen5day.interval,
            isAzithromycin: true,
            azithromycinRegimen: "5일요법",
            day1Dose: Math.round(day1Dose),
            day1Tablets,
            day2to5Dose: Math.round(day2to5Dose),
            day2to5Tablets,
            formationType: formulation.type,
            warningMessage,
          })
        }
      }
      return
    }

    let calculatedDose: number
    let dosageInfo = antibiotic.dosage

    const selectedConcentrationData = formulation.concentrations.find(
      (c) => c.value.toString() === selectedConcentration,
    )
    const isNeoSyrup = selectedConcentrationData?.isNeoSyrup === true

    if (selectedAntibiotic === "amoxicillin_clavulanate" && isNeoSyrup) {
      dosageInfo = antibiotic.dosage.neoSyrup
      calculatedDose = weightValue * dosageInfo.standard
    } else {
      calculatedDose = weightValue * dosageInfo.standard
    }

    if (calculatedDose > dosageInfo.maxSingleDose) {
      calculatedDose = dosageInfo.maxSingleDose
    }

    let totalDailyDose = calculatedDose * dosageInfo.frequency

    if (formulation.type === "suspension") {
      const volume = Math.round((calculatedDose / concentrationValue) * 10) / 10
      const totalDailyVolume = Math.round((totalDailyDose / concentrationValue) * 10) / 10

      setResults({
        singleDose: Math.round(calculatedDose),
        volume: Number.parseFloat(volume.toFixed(2)),
        totalDailyDose: Math.round(totalDailyDose),
        totalDailyVolume: Number.parseFloat(totalDailyVolume.toFixed(2)),
        frequency: dosageInfo.frequency,
        interval: dosageInfo.interval,
        isAzithromycin: false,
        formationType: "suspension",
        warningMessage,
      })
    } else {
      const tablets = calculateTabletFraction(
        calculatedDose,
        concentrationValue,
        formulation.type,
        selectedConcentrationData?.unit,
      )
      const totalDailyTablets = calculateTabletFraction(
        totalDailyDose,
        concentrationValue,
        formulation.type,
        selectedConcentrationData?.unit,
      )

      setResults({
        singleDose: Math.round(calculatedDose),
        tablets,
        totalDailyDose: Math.round(totalDailyDose),
        totalDailyTablets,
        frequency: dosageInfo.frequency,
        interval: dosageInfo.interval,
        isAzithromycin: false,
        formationType: formulation.type,
        warningMessage,
      })
    }

    let dosageData
    if (selectedAntibiotic === "amoxicillin" && selectedDisease && antibiotic.dosageByDisease) {
      dosageData = antibiotic.dosageByDisease[selectedDisease]
    } else {
      dosageData = antibiotic.dosage
    }

    calculatedDose = weightValue * dosageData.standard

    if (calculatedDose > dosageData.maxSingleDose) {
      calculatedDose = dosageData.maxSingleDose
    }

    totalDailyDose = calculatedDose * dosageData.frequency

    if (formulation.type === "suspension") {
      const volume = Math.round((calculatedDose / concentrationValue) * 10) / 10
      const totalDailyVolume = Math.round((totalDailyDose / concentrationValue) * 10) / 10

      setResults({
        singleDose: Math.round(calculatedDose),
        volume: Number.parseFloat(volume.toFixed(2)),
        totalDailyDose: Math.round(totalDailyDose),
        totalDailyVolume: Number.parseFloat(totalDailyVolume.toFixed(2)),
        frequency: dosageData.frequency,
        interval: dosageData.interval,
        isAzithromycin: false,
        formationType: "suspension",
        warningMessage,
      })
    } else {
      const tablets = calculateTabletFraction(
        calculatedDose,
        concentrationValue,
        formulation.type,
        selectedConcentrationData?.unit,
      )
      const totalDailyTablets = calculateTabletFraction(
        totalDailyDose,
        concentrationValue,
        formulation.type,
        selectedConcentrationData?.unit,
      )

      setResults({
        singleDose: Math.round(calculatedDose),
        tablets,
        totalDailyDose: Math.round(totalDailyDose),
        totalDailyTablets,
        frequency: dosageData.frequency,
        interval: dosageData.interval,
        isAzithromycin: false,
        formationType: "suspension",
        warningMessage,
      })
    }
  }

  const handleReset = () => {
    setAge("")
    setAgeUnit("년")
    setWeight("")
    setSelectedAntibiotic("")
    setSelectedFormulation("")
    setSelectedConcentration("")
    setSelectedRegimen("")
    setShowAntibiotics(false)
    setResults(null)
    setError("")
    setSelectedDisease("")
  }

  const handleAntibioticBoxClick = () => {
    setShowAntibiotics(true)
  }

  const selectedAntibioticData = selectedAntibiotic ? antibiotics[selectedAntibiotic] : null
  const selectedFormulationData =
    selectedAntibioticData && selectedFormulation !== ""
      ? selectedAntibioticData.formulations[Number.parseInt(selectedFormulation)]
      : null

  const getDosageFormula = (antibiotic: AntibioticKey, selectedConcentrationData: any, selectedRegimen?: string) => {
    const antibioticData = antibiotics[antibiotic]

    if (antibiotic === "azithromycin") {
      if (selectedRegimen === "3day") {
        return "10mg/kg/일 × 1회/일 × 3일"
      } else {
        return "첫날 10mg/kg, 이후 4일간 5mg/kg/일 × 1회/일"
      }
    }

    if (antibiotic === "amoxicillin_clavulanate" && selectedConcentrationData?.isNeoSyrup) {
      return "90mg/kg/일 ÷ 2회 (아목시실린 기준)"
    }

    if (antibiotic === "amoxicillin_clavulanate") {
      return "45mg/kg/일 ÷ 2회 (아목시실린 기준)"
    }

    if (antibiotic === "cefpodoxime") {
      return "10mg/kg/일 ÷ 2회"
    }

    if (antibiotic === "cefadroxil") {
      return "30mg/kg/일 ÷ 2회"
    }

    if (antibiotic === "clarithromycin") {
      return "15mg/kg/일 ÷ 2회"
    }

    if (antibiotic === "cefixime") {
      return "6mg/kg/일 ÷ 2회"
    }

    if (antibiotic === "cefdinir") {
      return "18mg/kg/일 ÷ 3회"
    }

    if (antibiotic === "cefditoren") {
      return "9mg/kg/일 ÷ 3회"
    }

    if (antibiotic === "cefcapene") {
      return "9mg/kg/일 ÷ 3회"
    }

    if (antibiotic === "tmp_smx") {
      return "TMP 8mg/kg/일 ÷ 2회"
    }
    if (antibiotic === "roxithromycin") {
      return "8mg/kg/일 ÷ 2회"
    }
    if (antibiotic === "clindamycin") {
      return "12mg/kg/일 ÷ 3회"
    }
    if (antibiotic === "cefprozil") {
      return "22.5mg/kg/일 ÷ 2회"
    }
    if (antibiotic === "doxycycline") {
      return "4mg/kg/일 ÷ 2회"
    }
    if (antibiotic === "minocycline") {
      return "4mg/kg/일 ÷ 2회"
    }
    if (antibiotic === "levofloxacin") {
      return "18mg/kg/일 ÷ 2회 (5세 미만) 또는 9mg/kg/일 ÷ 1회 (5세 이상)"
    }
    if (antibiotic === "tosufloxacin") {
      return "12mg/kg/일 ÷ 2회"
    }

    return ""
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-lg animate-pulse-glow">
                <Calculator className="w-8 h-8 text-primary-foreground" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-accent-foreground">Rx</span>
              </div>
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-3">
            소아 항생제 용량 계산기
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            의료 전문가를 위한 정확하고 신뢰할 수 있는 소아 항생제 용량 계산 도구
          </p>
          <div className="flex items-center justify-center gap-4 mt-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>정확한 용량 계산</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-accent rounded-full"></div>
              <span>다양한 항생제 지원</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-secondary rounded-full"></div>
              <span>의료진 전용</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <Card className="shadow-xl border-0 bg-card/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 animate-fade-in-up">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 border-b border-border/50">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Calculator className="w-5 h-5 text-primary" />
                </div>
                <span className="text-card-foreground">계산 입력</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8 p-6">
              <div className="space-y-6">
                <div className="flex items-center gap-2 pb-2 border-b border-border/30">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <h3 className="text-lg font-semibold text-card-foreground">환아 정보</h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age" className="text-sm font-medium">
                      나이
                    </Label>
                    <Input
                      id="age"
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      placeholder="예: 3"
                      min="0"
                      step="0.1"
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="age-unit" className="text-sm font-medium">
                      단위
                    </Label>
                    <Select value={ageUnit} onValueChange={setAgeUnit}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="년">년</SelectItem>
                        <SelectItem value="개월">개월</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weight" className="text-sm font-medium">
                    체중 (kg)
                  </Label>
                  <Input
                    id="weight"
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="예: 12.5"
                    min="0"
                    step="0.1"
                    className="w-full"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-border/30">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <h3 className="text-lg font-semibold text-card-foreground">항생제 선택</h3>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="antibiotic" className="text-sm font-medium text-gray-700">
                    항생제 선택
                  </Label>
                  {!selectedCategory ? (
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="항생제 계통을 선택하세요" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(categories).map(([categoryKey, category]) => (
                          <SelectItem key={categoryKey} value={categoryKey}>
                            <div className="flex flex-col items-start w-full">
                              <span className="font-medium">{category.name}</span>
                              <span className="text-xs text-gray-500 mt-1">
                                {category.antibiotics.map((key) => antibiotics[key as AntibioticKey]?.name).join(", ")}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : !selectedAntibiotic ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-md">
                        <span className="font-medium text-blue-900">
                          {categories[selectedCategory as keyof typeof categories]?.name}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedCategory("")
                            setSelectedAntibiotic("")
                          }}
                          className="text-blue-700 hover:text-blue-900"
                        >
                          다른 계통 선택
                        </Button>
                      </div>
                      <RadioGroup
                        value={selectedAntibiotic}
                        onValueChange={(value: AntibioticKey) => setSelectedAntibiotic(value)}
                        className="space-y-2"
                      >
                        {categories[selectedCategory as keyof typeof categories]?.antibiotics.map((antibioticKey) => {
                          const antibiotic = antibiotics[antibioticKey as AntibioticKey]
                          return (
                            <div
                              key={antibioticKey}
                              className="flex items-center space-x-3 p-3 border-2 border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 cursor-pointer data-[state=checked]:border-blue-500 data-[state=checked]:bg-blue-100"
                            >
                              <RadioGroupItem
                                value={antibioticKey}
                                id={`antibiotic-${antibioticKey}`}
                                className="border-2 border-gray-400 w-5 h-5 data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600"
                              />
                              <Label htmlFor={`antibiotic-${antibioticKey}`} className="cursor-pointer flex-1">
                                <div>
                                  <div className="font-medium">{antibiotic.name}</div>
                                  <div className="text-sm text-gray-500">{antibiotic.brandName}</div>
                                </div>
                              </Label>
                            </div>
                          )
                        })}
                      </RadioGroup>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                        <div className="font-medium text-blue-900">{selectedAntibioticData?.name}</div>
                        <div className="text-sm text-blue-700">{selectedAntibioticData?.brandName}</div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedAntibiotic("")
                          setSelectedFormulation("")
                          setSelectedConcentration("")
                          setSelectedRegimen("")
                        }}
                        className="text-xs"
                      >
                        다른 항생제 선택
                      </Button>
                    </div>
                  )}
                </div>

                {selectedAntibiotic === "azithromycin" && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">투여 요법</Label>
                    <RadioGroup value={selectedRegimen} onValueChange={setSelectedRegimen} className="mt-3">
                      <div className="flex items-center space-x-3 p-3 border-2 border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 cursor-pointer">
                        <RadioGroupItem
                          value="3day"
                          id="regimen-3day"
                          className="border-2 border-gray-400 w-5 h-5 data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600"
                        />
                        <Label htmlFor="regimen-3day" className="cursor-pointer">
                          3일요법 (10mg/kg/일 × 3일)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-3 border-2 border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 cursor-pointer">
                        <RadioGroupItem
                          value="5day"
                          id="regimen-5day"
                          className="border-2 border-gray-400 w-5 h-5 data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600"
                        />
                        <Label htmlFor="regimen-5day" className="cursor-pointer">
                          5일요법 (첫날 10mg/kg, 이후 4일간 5mg/kg)
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                )}

                {selectedAntibioticData && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">제형 ({selectedAntibioticData.brandName})</Label>
                    <RadioGroup value={selectedFormulation} onValueChange={setSelectedFormulation} className="mt-3">
                      {selectedAntibioticData.formulations.map((formulation, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-3 p-3 border-2 border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 cursor-pointer"
                        >
                          <RadioGroupItem
                            value={index.toString()}
                            id={`formulation-${index}`}
                            className="border-2 border-gray-400 w-5 h-5 data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600"
                          />
                          <Label htmlFor={`formulation-${index}`} className="cursor-pointer">
                            {formulation.name}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                )}

                {selectedFormulationData && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">제품 농도</Label>
                    <RadioGroup value={selectedConcentration} onValueChange={setSelectedConcentration} className="mt-3">
                      {selectedFormulationData.concentrations.map((concentration, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-3 p-3 border-2 border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 cursor-pointer"
                        >
                          <RadioGroupItem
                            value={concentration.value.toString()}
                            id={`concentration-${index}`}
                            className="border-2 border-gray-400 w-5 h-5 data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600"
                          />
                          <Label htmlFor={`concentration-${index}`} className="cursor-pointer">
                            <div>
                              <div>{concentration.label}</div>
                              {concentration.description && (
                                <div className="text-xs text-gray-500 mt-1">{concentration.description}</div>
                              )}
                            </div>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                )}

                {selectedAntibioticData && selectedAntibioticData.hasDiseaseDosing && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">질환/적응증 선택</Label>
                    <RadioGroup value={selectedDisease} onValueChange={setSelectedDisease} className="mt-3">
                      {Object.entries(diseaseOptions).map(([key, label]) => (
                        <div
                          key={key}
                          className="flex items-center space-x-3 p-3 border-2 border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 cursor-pointer"
                        >
                          <RadioGroupItem
                            value={key}
                            id={`disease-${key}`}
                            className="border-2 border-gray-400 w-5 h-5 data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600"
                          />
                          <Label htmlFor={`disease-${key}`} className="cursor-pointer text-sm">
                            {label}
                            {selectedAntibioticData.dosageByDisease[key] && (
                              <div className="text-xs text-gray-500 mt-1">
                                {selectedAntibioticData.dosageByDisease[key].description}
                              </div>
                            )}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <Button onClick={handleCalculate} className="flex-1">
                  계산하기
                </Button>
                <Button onClick={handleReset} variant="outline" className="flex-1 bg-transparent">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  초기화
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>계산 결과</CardTitle>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                  <AlertCircle className="w-5 h-5" />
                  <span>{error}</span>
                </div>
              )}

              {results?.warningMessage && (
                <div className="flex items-center gap-2 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700 mb-4">
                  <AlertCircle className="w-5 h-5" />
                  <span>{results.warningMessage}</span>
                </div>
              )}

              {results && !error && (
                <div className="space-y-4">
                  {selectedAntibiotic === "amoxicillin" && (
                    <div className="text-sm text-gray-600 mb-4 p-3 bg-blue-50 rounded-lg">
                      <strong>용량 계산 공식:</strong> 50mg/kg/일 ÷ 3회 = {(50 / 3).toFixed(1)}mg/kg/회
                    </div>
                  )}

                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h4 className="font-semibold text-yellow-800 mb-1 text-sm">계산 공식</h4>
                    <p className="text-sm text-yellow-700">
                      {getDosageFormula(
                        selectedAntibiotic as AntibioticKey,
                        selectedFormulationData?.concentrations.find(
                          (c) => c.value.toString() === selectedConcentration,
                        ),
                        selectedRegimen,
                      )}
                    </p>
                  </div>

                  {results.isAzithromycin && results.azithromycinRegimen === "5일요법" ? (
                    <>
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <h4 className="font-semibold text-blue-800 mb-2">첫 1일 투여 용량</h4>
                        <p className="text-2xl font-bold text-blue-900">
                          {formatNumber(results.day1Dose)} mg
                          {results.formationType === "suspension" &&
                            results.day1Volume &&
                            ` (${formatNumber(results.day1Volume, true)} mL)`}
                          {results.formationType !== "suspension" &&
                            results.day1Tablets &&
                            ` (${results.day1Tablets.fraction})`}
                        </p>
                      </div>

                      <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                        <h4 className="font-semibold text-purple-800 mb-2">나머지 4일 투여 용량</h4>
                        <p className="text-2xl font-bold text-purple-900">
                          {formatNumber(results.day2to5Dose)} mg
                          {results.formationType === "suspension" &&
                            results.day2to5Volume &&
                            ` (${formatNumber(results.day2to5Volume, true)} mL)`}
                          {results.formationType !== "suspension" &&
                            results.day2to5Tablets &&
                            ` (${results.day2to5Tablets.fraction})`}
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-2">1회 투여 용량</h4>
                      <p className="text-2xl font-bold text-blue-900">
                        {formatNumber(results.singleDose)} mg
                        {results.formationType === "suspension" &&
                          results.volume &&
                          ` (${formatNumber(results.volume, true)} mL)`}
                        {results.formationType !== "suspension" && results.tablets && ` (${results.tablets.fraction})`}
                      </p>
                    </div>
                  )}

                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">용법</h4>
                    <p className="text-lg text-green-900">
                      1일 {results.frequency}회, {results.interval} 간격으로 투여
                    </p>
                    {results.isAzithromycin && (
                      <p className="text-sm text-green-700 mt-2">※ {results.azithromycinRegimen}</p>
                    )}
                  </div>

                  {!(results.isAzithromycin && results.azithromycinRegimen === "5일요법") && (
                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                      <h4 className="font-semibold text-gray-800 mb-2">1일 총 투여량</h4>
                      <p className="text-lg text-gray-900">
                        {formatNumber(results.totalDailyDose)} mg
                        {results.formationType === "suspension" &&
                          results.totalDailyVolume &&
                          ` (${formatNumber(results.totalDailyVolume, true)} mL)`}
                        {results.formationType !== "suspension" &&
                          results.totalDailyTablets &&
                          ` (${formatNumber(results.totalDailyTablets, true)}`}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {!results && !error && (
                <div className="text-center py-8 text-gray-500">
                  <Calculator className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>
                    환아 정보와 항생제를 선택한 후<br />
                    계산하기 버튼을 눌러주세요.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {selectedAntibioticData && (
          <Card className="shadow-lg mb-8">
            <CardContent className="p-0">
              <Accordion type="single" collapsible>
                <AccordionItem value="info">
                  <AccordionTrigger className="px-6 py-4">자세한 정보 - {selectedAntibioticData.name}</AccordionTrigger>
                  <AccordionContent className="px-6 pb-4">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-2">대표 제품</h4>
                        <p className="text-gray-600">{selectedAntibioticData.brandName}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-2">적응증</h4>
                        <p className="text-gray-600">{selectedAntibioticData.info.indications}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-2">주의사항</h4>
                        <p className="text-gray-600">{selectedAntibioticData.info.precautions}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-2">보관방법</h4>
                        <p className="text-gray-600">{selectedAntibioticData.info.storage}</p>
                      </div>
                      {selectedAntibioticData.info.specialNote && (
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-2">특별 주의사항</h4>
                          <p className="text-gray-600">{selectedAntibioticData.info.specialNote}</p>
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        )}

        <footer className="text-center text-sm text-gray-500 bg-white p-4 rounded-lg shadow">
          <div className="space-y-2">
            <p>
              본 계산기는 의료 전문가를 위한 참고 자료이며, 실제 처방은 반드시 의사의 전문적인 판단에 따라야 합니다.
            </p>
            <p>개발자는 계산 결과에 대한 법적 책임을 지지 않습니다.</p>

            <div className="mt-4 pt-3 border-t border-gray-200">
              <div className="text-xs text-gray-400 space-y-1">
                <p>
                  <strong>개발자:</strong> 안상현 (가정의학과 전문의)
                </p>
                <p>
                  <strong>소속:</strong> 모바일닥터 최고의료책임 | MoDoc AI 의료알고리즘책임
                </p>
                <p>
                  <strong>연락처:</strong> sanghyun@fevercoach.net
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
