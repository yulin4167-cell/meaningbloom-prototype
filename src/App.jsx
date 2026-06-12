import { useState, useEffect, useRef } from 'react'
import './App.css'

/* ── Languages ────────────────────────────── */
const LANGUAGES = [
  { id: 'en',    label: 'English',        native: 'English' },
  { id: 'zh',    label: 'Mandarin',       native: '普通话' },
  { id: 'yue',   label: 'Cantonese',      native: '廣東話' },
  { id: 'es',    label: 'Spanish',        native: 'Español' },
  { id: 'vi',    label: 'Vietnamese',     native: 'Tiếng Việt' },
  { id: 'tl',    label: 'Tagalog',        native: 'Tagalog' },
  { id: 'ru',    label: 'Russian',        native: 'Русский' },
  { id: 'other', label: 'Other',          native: '其他 / Otros' },
]

/* ── Data ─────────────────────────────────── */
const NEEDS_OPTIONS = [
  { id: 'activities', en: 'Find local activities',  zh: '找本地活动',     emoji: '🗓️', icon: 'calendar' },
  { id: 'meet',       en: 'Meet people',             zh: '认识新朋友',     emoji: '◎',  icon: 'circles'  },
  { id: 'english',    en: 'Practice English',        zh: '练习英文',       emoji: '💬', icon: 'bubble'   },
  { id: 'form',       en: 'Get help with a form',   zh: '填表或看表格',   emoji: '📄', icon: 'doc'      },
  { id: 'housing',    en: 'Housing or apartment',   zh: '住房或公寓问题', emoji: '⌂',  icon: 'house'    },
  { id: 'health',     en: 'Healthcare or clinic',   zh: '医疗或诊所问题', emoji: '✚',  icon: 'cross'    },
  { id: 'notsure',    en: 'Not sure yet',            zh: '还不确定',       emoji: '○',  icon: 'circle-q' },
  { id: 'other',      en: 'Something else',          zh: '其他',           emoji: '…',  icon: 'dots'     },
]

const PREF_OPTIONS = [
  { id: 'slow',        en: 'Please speak slowly',               zh: '请说慢一点',             emoji: '〜' },
  { id: 'onequestion', en: 'Ask one question at a time',        zh: '请一次问一个问题',       emoji: '·' },
  { id: 'time',        en: 'I may need time to explain',        zh: '我可能需要一点时间解释', emoji: '◷' },
  { id: 'writesteps',  en: 'Please write down the next steps',  zh: '请帮我写下下一步',       emoji: '✎' },
  { id: 'chinese',     en: 'I may use my home language',        zh: '我可能会用母语说几个词', emoji: '文' },
  { id: 'nopref',      en: 'No preference',                     zh: '没有特别偏好',           emoji: '✓' },
]

const RECOVERY_MISUNDERSTOOD = [
  { id: 'notmean', en: "That's not what I mean",                    zh: '这不是我的意思',
    phrase: "That's not exactly what I mean. Can I explain it another way?" },
  { id: 'another', en: 'I want to explain it another way',          zh: '我想换一种方式解释',
    phrase: "Let me try to explain it a different way." },
  { id: 'social',  en: 'I mean social activities, not only classes', zh: '我想找社交活动，不只是课',
    phrase: "I'm looking for social activities where I can meet people, not only classes." },
]

const RECOVERY_STUCK = [
  { id: 'moretime',    en: 'I need more time to think',                     zh: '我需要一点时间想',
    phrase: "I need a little more time to think. Please give me a moment." },
  { id: 'cantexplain', en: "I don't know how to explain it in English",      zh: '我不知道怎么用英文解释',
    phrase: "I know what I mean, but I'm still finding the English words. Can I try again?" },
  { id: 'onequestion', en: 'Please ask me one question at a time',           zh: '请一次问我一个问题',
    phrase: "Could you ask me one question at a time?" },
  { id: 'tryagain',    en: 'I want to try again',                            zh: '我想再试一次',
    phrase: "Let me try again. I want to explain this differently." },
]

const MEANING_BY_CONTEXT = {
  social: [
    { id: 'social',    en: 'Social activities', zh: '社交活动',     emoji: '🎉' },
    { id: 'lunch',     en: 'Community lunch',   zh: '社区午餐',     emoji: '🍜' },
    { id: 'walking',   en: 'Walking group',     zh: '步行小组',     emoji: '🚶' },
    { id: 'volunteer', en: 'Volunteer events',  zh: '志愿者活动',   emoji: '🙌' },
    { id: 'english',   en: 'English classes',   zh: '英文课',       emoji: '📚' },
    { id: 'other',     en: 'Something else',    zh: '其他',         emoji: '💬' },
  ],
  english: [
    { id: 'classes',   en: 'English classes',    zh: '英文课',       emoji: '📚' },
    { id: 'convgroup', en: 'Conversation group', zh: '英文交流小组', emoji: '💬' },
    { id: 'partner',   en: 'Practice partner',   zh: '练习伙伴',     emoji: '🤝' },
    { id: 'social',    en: 'Social activities',  zh: '社交活动',     emoji: '🎉' },
  ],
  housing: [
    { id: 'apartment',   en: 'Apartment question', zh: '公寓问题',   emoji: '🏠' },
    { id: 'lease',       en: 'Lease question',     zh: '租约问题',   emoji: '📄' },
    { id: 'maintenance', en: 'Maintenance help',   zh: '维修帮助',   emoji: '🔧' },
    { id: 'other',       en: 'Something else',     zh: '其他',       emoji: '💬' },
  ],
  default: [
    { id: 'social',    en: 'Social activities', zh: '社交活动',   emoji: '🎉' },
    { id: 'english',   en: 'English classes',   zh: '英文课',     emoji: '📚' },
    { id: 'volunteer', en: 'Volunteer events',  zh: '志愿者活动', emoji: '🙌' },
    { id: 'housing',   en: 'Housing help',      zh: '住房帮助',   emoji: '🏠' },
    { id: 'other',     en: 'Something else',    zh: '其他',       emoji: '💬' },
  ],
}

/* ── Translation Dictionary ───────────────── */
const T = {
  en: {
    appSubtitle: 'A shared meaning-check and conversation recovery system for everyday service conversations.',
    appDesc: 'MeaningBloom helps visitors and staff slow down, clarify meaning, and recover from misunderstanding without replacing the speaker\'s voice.',
    appPhrase: 'Fragmented English does not mean fragmented thinking.',
    chooseView: 'Choose your view', chooseLanguage: 'Choose your preferred language',
    langNote: 'Your experience will use English + your selected language.',
    customerTitle: 'Customer / Visitor', customerDesc: 'I am here to ask for help or information.',
    staffTitle: 'Staff', staffDesc: 'I am helping visitors understand services.',
    enterCustomer: 'Enter as Visitor', enterStaff: 'Enter as Staff',
    connected: 'MeaningBloom connects both views. What the visitor shares shapes what staff sees.',
    selectLangFirst: 'Please select a language to continue.',
    changeLang: 'Language', closePanel: 'Close',
    cs1Title: 'What brings you here today?', cs1Inst: 'Choose one or more. You can change this later.',
    next: 'Next', back: 'Back',
    cs2Title: 'What would make this conversation feel easier?',
    cs2Inst: 'Optional. Choose anything that would help the conversation feel clearer.',
    cs3Title: 'Before we connect you with staff',
    lookingFor: 'You are looking for:', convPrefs: 'Conversation preferences:',
    noPrefSelected: 'No preference selected', doesLookRight: 'Does this look right?',
    shareWithStaff: 'Share with staff', edit: 'Edit',
    sharedSuccess: 'Your request has been shared with staff.',
    goStaffView: 'Go to Staff View', continueCustomer: 'Continue as Visitor',
    cs4Title: 'During the conversation',
    cs4Sub: 'If something feels unclear, you can use a meaning-check or a gentle recovery prompt.',
    feelMisunderstood: 'I feel misunderstood', feelStuck: 'I feel stuck',
    change: 'Change', sendSignal: 'Send a gentle signal to staff',
    signalSent: 'Signal sent to staff', viewStaffResp: 'View Staff Response',
    editSentence: 'Edit this phrase', cancel: 'Cancel',
    seeNextStep: 'See next step summary →',
    canSayThis: 'You can say this, edit it, or ignore it.',
    cs5Title: 'Here is what we understood', suggestedNextSteps: 'Suggested next steps:', done: 'Done ✓',
    ss1Title: 'Staff View', noRequestYet: 'The loop is open.',
    noRequestSub: 'Waiting for the visitor to complete their meaning check.',
    switchCustomer: 'Switch to Visitor View', visitorLookingFor: 'They shared this with you:',
    convPrefsStaff: 'How they would like to communicate:',
    useDashboard: 'Say this — then listen. Verify, don\'t assume.',
    checkMeaningBtn: '✦ Check Meaning', recoveryBtn: '✦ Repair the Loop',
    createSummaryBtn: '✦ Close the Loop', suggestedOpening: 'Open the loop with:',
    ss2Title: 'What do they likely mean?', ss2Sub: 'Select the meanings that fit — then say the phrase aloud to verify together.',
    ss2Note: 'Clarifying is not correcting — it is listening more closely.',
    basedOnRequest: "Based on what the visitor shared, they may be looking for:",
    staffPhrase: 'Say to verify:', confirmMeaning: 'Confirm meaning',
    backToDash: '← Back',
    meaningConfTitle: 'Meaning clarified together', meaningConfLabel: 'Meaning clarified:',
    ss3Title: 'The loop needs repair', recoveryAlert: 'Loop interrupted',
    visitorNeedsSup: 'The visitor needs:',
    suggestedStaffResp: 'Say this to bring them back:', generalGuidance: 'Loop repair tools — use one:',
    ss4Title: 'Close the Loop', hereIsUnderstood: 'What you clarified together:',
    nextStepsLabel: 'Steps to share with them:', sendToCustomer: 'Send to visitor — close the loop',
    summarySent: 'Loop closed · Summary shared with visitor',
    writeDown: '✦ Write this down, text it, or print it for the visitor to take home.',
    activities: 'Find local activities', meet: 'Meet people', english: 'Practice English',
    form: 'Get help with a form', housing: 'Housing or apartment', health: 'Healthcare or clinic',
    notsure: 'Not sure yet', other: 'Something else',
    slow: 'Please speak slowly', onequestion: 'Ask one question at a time',
    time: 'I may need time to explain', writesteps: 'Please write down the next steps',
    chinese: 'I may use my home language', nopref: 'No preference',
    notmean: "That's not what I mean", another: 'I want to explain it another way',
    social: 'Social activities / not only classes',
    moretime: 'I need more time to think', cantexplain: "I don't know how to explain in English",
    tryagain: 'I want to try again',
    lunch: 'Community lunch', walking: 'Walking group', volunteer: 'Volunteer events',
    classes: 'English classes', convgroup: 'Conversation group', partner: 'Practice partner',
    apartment: 'Apartment question', lease: 'Lease question', maintenance: 'Maintenance help',
    liveInterpTitle: 'Live Interpretation', liveInterpToggle: '🌐 Interpret',
    liveInterpActive: '● Live', liveInterpOff: 'Turn off',
    liveInterpInput: 'Speak or type in your language…',
    liveInterpOutputLabel: 'Staff sees (English):', liveInterpTyping: 'Visitor is speaking…',
    liveInterpDemoNote: '',
    micStart: '🎤 Speak', micStop: '⏹ Stop', micListening: '● Listening…',
    micUnsupported: 'Voice not supported — please type below.',
    lipClearBtn: 'Clear',
    startLbl: 'Start',
    roleTagline: 'Let meaning unfold beyond fragmented English.',
    visitorSharedBadge: 'Visitor has shared their request',
    visitorLanguageLbl: "Visitor's language:",
    visitorFeelingMisunderstood: 'They feel their meaning wasn\'t understood.',
    visitorFeelingStuck: 'They feel stuck — the loop needs repair.',
    sentToVisitor: 'Sent to visitor',
    sharedWithStaff: 'Shared with staff',
    switchToStaffNote: 'Switch to Staff View to see how staff receives this information.',
    suggestedSentence: 'Suggested sentence',
    updatedFromStaff: 'Updated from staff',
    closingTitle: 'MeaningBloom helped this conversation.',
    closingAffirm1: 'Meaning was clarified',
    closingAffirm2: 'Visitor stayed in control',
    closingAffirm3: 'Next steps were clear',
    closingLine1: 'The goal is not perfect English.',
    closingLine2: 'The goal is fuller expression, better understanding, and a conversation that can keep going.',
    connectVisitor: 'Visitor', connectStaff: 'Staff',
    saveLbl: 'Save', textMeLbl: 'Text me', printLbl: 'Print',
    beforeYouBegin: 'Before you begin:', listenFirst: 'Listen first. Let them finish.',
    doNotGuess: 'Do not guess or complete their sentence.',
    checkMeaningGently: 'Check meaning gently, not correctively.',
    giveTime: 'Give the visitor time. Do not rush.',
    doNotFinish: 'Do not finish their sentence for them.',
    askOneQStaff: 'Ask one question at a time.',
    staffNoteTime: 'Give the visitor time before guessing.',
    staffNoteWritesteps: 'Write down the next step before the visitor leaves.',
    staffNoteChinese: 'Visitor may use their home language for some words.',
    sfiVisitor: 'Visitor shared', sfiStaff: 'Staff understands', sfiShared: 'Shared meaning',
    meaningVisitorLabel: 'Visitor', meaningStaffLabel: 'Staff',
    checkMeaningNav: 'Check Meaning', recoverySupportNav: 'Repair the Loop',
    createSummaryNav: 'Close the Loop',
    clearloopPrinciple: 'What they mean matters more than how they said it.',
    dontAssume: 'Verify, don\'t assume.',
    loopRepairIntro: 'The loop lost connection. Here\'s how to bring it back.',
    loopStatus: 'ClearLoop · Meaning Check',
    sharedMeaningNote: 'This is what you clarified together.',
    tabSubCheck: 'before you assume',
    tabSubRepairIdle: 'if connection breaks',
    tabSubRepairActive: 'signal received',
    tabSubClose: 'build shared summary',
    meaningVerifiedNote: 'You verified meaning together. The loop holds.',
    selectMeaningsHint: 'Select meanings above to build the phrase.',
    staffCheckingMeaning: 'Staff is verifying your meaning',
    staffVerifyPrompt: 'Is this what you mean?',
    customerConfirmYes: 'Yes, that\'s right',
    customerConfirmNo: 'Not quite — let me explain',
    customerHasConfirmed: 'Visitor confirmed ✓',
    waitingConfirmation: 'Waiting for visitor confirmation…',
    ns1: 'Saturday Community Lunch', ns2: 'Beginner Walking Group', ns3: 'Local Volunteer Event',
    wordBridgeVisitorLabel: 'Share one word that describes how you feel right now',
    wordBridgeStaffLabel: 'Write one word back to the visitor',
    wordBridgePlaceholder: 'One word…',
    wordBridgeVisitorEcho: 'Visitor wrote:',
    wordBridgeStaffEcho: 'Staff wrote:',
    breatheTogether: 'Breathe together',
    staffAckBtn: 'I\'m present — ready to clarify together',
    staffAckedBadge: '✓ Staff has seen your request',
  },
  zh: {
    appSubtitle: '一个帮助日常服务对话相互理解的工具。',
    chooseView: '选择你的视角', chooseLanguage: '选择你的语言',
    customerTitle: '访客 / 使用者', customerDesc: '我想咨询信息或获得帮助。',
    staffTitle: '工作人员', staffDesc: '我正在帮助访客了解服务。',
    enterCustomer: '进入访客视角', enterStaff: '进入工作人员视角',
    connected: '两个视角是连接的。访客的选择会影响工作人员看到的内容。',
    selectLangFirst: '请先选择语言。', changeLang: '语言', closePanel: '关闭',
    cs1Title: '今天你想了解什么？', cs1Inst: '选择一个或多个。你以后可以更改。',
    next: '下一步', back: '返回',
    cs2Title: '怎样沟通会让你更舒服？',
    cs2Inst: '可选。选择任何让对话更清晰的选项。',
    cs3Title: '在和工作人员沟通前',
    lookingFor: '你在寻找：', convPrefs: '对话偏好：',
    noPrefSelected: '没有选择偏好', doesLookRight: '这些信息对吗？',
    shareWithStaff: '分享给工作人员', edit: '修改',
    sharedSuccess: '工作人员已经看到你的信息。',
    goStaffView: '前往工作人员视角', continueCustomer: '继续访客操作',
    cs4Title: '对话过程中',
    cs4Sub: '如果有什么不清楚的，你可以使用意义检查或恢复提示。',
    feelMisunderstood: '我觉得对方误解了我', feelStuck: '我有点卡住了',
    change: '更改', sendSignal: '向工作人员发送恢复信号',
    signalSent: '恢复信号已发送', viewStaffResp: '查看工作人员回应',
    editSentence: '编辑句子', cancel: '取消',
    seeNextStep: '查看下一步总结 →',
    canSayThis: '你可以说这句话、编辑它或忽略它。',
    cs5Title: '我们理解的是', suggestedNextSteps: '建议的下一步：', done: '完成 ✓',
    activities: '找本地活动', meet: '认识新朋友', english: '练习英文',
    form: '填表或看表格', housing: '住房或公寓问题', health: '医疗或诊所问题',
    notsure: '还不确定', other: '其他',
    slow: '请说慢一点', onequestion: '请一次问一个问题',
    time: '我可能需要时间解释', writesteps: '请帮我写下下一步',
    chinese: '我可能会用母语说几个词', nopref: '没有特别偏好',
    notmean: '这不是我的意思', another: '我想换一种方式解释',
    social: '社交活动，不只是课程',
    moretime: '我需要一点时间想', cantexplain: '我不知道怎么用英文解释',
    tryagain: '我想再试一次',
    lunch: '社区午餐', walking: '步行小组', volunteer: '志愿者活动',
    classes: '英文课', convgroup: '英文交流小组', partner: '练习伙伴',
    apartment: '公寓问题', lease: '租约问题', maintenance: '维修帮助',
    liveInterpTitle: '同声传译', liveInterpToggle: '🌐 传译',
    liveInterpActive: '● 传译中', liveInterpOff: '关闭',
    liveInterpInput: '用你的语言说话或输入…',
    liveInterpOutputLabel: '工作人员看到（英文）：', liveInterpTyping: '访客正在发言…',
    micStart: '🎤 说话', micStop: '⏹ 停止', micListening: '● 正在聆听…',
    micUnsupported: '不支持语音 — 请在下方输入文字。',
    lipClearBtn: '清除',
    startLbl: '开始',
    roleTagline: '让意义在不完整的英语之外展开。',
    visitorSharedBadge: '访客已分享他们的请求',
    visitorLanguageLbl: '访客的语言：',
    visitorFeelingMisunderstood: '他们觉得自己的意思没有被理解。',
    visitorFeelingStuck: '他们感到卡住了 — 循环需要修复。',
    sentToVisitor: '已发送给访客',
    sharedWithStaff: '已分享给工作人员',
    switchToStaffNote: '切换到工作人员视角，查看工作人员如何接收这些信息。',
    suggestedSentence: '建议的句子', updatedFromStaff: '来自工作人员的更新',
    closingTitle: 'MeaningBloom 帮助了这次对话。',
    closingAffirm1: '意思已澄清', closingAffirm2: '访客保持了主导权', closingAffirm3: '下一步已明确',
    closingLine1: '目标不是完美的英语。',
    closingLine2: '目标是更完整的表达、更好的理解，以及一段可以继续的对话。',
    connectVisitor: '访客', connectStaff: '工作人员',
    saveLbl: '保存', textMeLbl: '发短信', printLbl: '打印',
    ss1Title: '工作人员视角', ss2Title: '他们可能是什么意思？', ss3Title: '循环需要修复',
    ss4Title: '结束循环', meaningConfTitle: '一起确认了意思', meaningConfLabel: '确认的意思：',
    suggestedOpening: '开启循环：', useDashboard: '说出来 — 然后倾听。去验证，不要假设。',
    visitorLookingFor: '他们与你分享的：', convPrefsStaff: '他们希望的沟通方式：',
    ss2Sub: '选择符合的意思 — 然后大声说出短语，一起确认。',
    ss2Note: '澄清不是纠正 — 而是更仔细地倾听。',
    basedOnRequest: '根据访客的分享，他们可能在寻找：',
    staffPhrase: '说出来确认：', confirmMeaning: '确认意思',
    backToDash: '← 返回',
    visitorNeedsSup: '访客需要：',
    suggestedStaffResp: '说这句话帮他们回来：', generalGuidance: '循环修复工具 — 选一个：',
    hereIsUnderstood: '你们一起确认的：', nextStepsLabel: '要与他们分享的步骤：',
    sendToCustomer: '发送给访客 — 结束循环', summarySent: '循环已结束 · 摘要已与访客分享',
    writeDown: '✦ 写下来、发短信或打印给访客带回家。',
    noRequestYet: '循环已开启。', noRequestSub: '等待访客完成意思确认。',
    switchCustomer: '切换到访客视角', recoveryAlert: '循环中断',
    clearloopPrinciple: '他们的意思比他们说的方式更重要。',
    dontAssume: '去验证，不要假设。',
    loopRepairIntro: '循环失去了连接。以下是如何重新建立它。',
    loopStatus: 'ClearLoop · 意思确认',
    sharedMeaningNote: '这是你们一起确认的。',
    tabSubCheck: '确认之前', tabSubRepairIdle: '如果连接断开',
    tabSubRepairActive: '已收到信号', tabSubClose: '建立共同摘要',
    meaningVerifiedNote: '你们一起确认了意思。循环保持连接。',
    selectMeaningsHint: '请在上方选择意思来建立短语。',
    beforeYouBegin: '开始前：', listenFirst: '先听完。让他们说完。',
    doNotGuess: '不要猜测或替他们说完句子。',
    checkMeaningGently: '轻柔地确认意思，而不是纠正。',
    giveTime: '给访客时间。不要催。', doNotFinish: '不要帮他们说完句子。',
    askOneQStaff: '一次只问一个问题。',
    staffNoteTime: '在猜测之前给访客时间。',
    staffNoteWritesteps: '在访客离开前写下下一步。',
    staffNoteChinese: '访客可能会用母语说一些词。',
    sfiVisitor: '访客已分享', sfiStaff: '工作人员理解', sfiShared: '共同理解',
    meaningVisitorLabel: '访客', meaningStaffLabel: '工作人员',
    checkMeaningNav: '确认意思', recoverySupportNav: '修复循环',
    createSummaryNav: '结束循环',
    ns1: '周六社区午餐', ns2: '初级步行小组', ns3: '本地志愿者活动',
    wordBridgeVisitorLabel: '用一个词描述你现在的感受',
    wordBridgeStaffLabel: '回写一个词给访客',
    wordBridgePlaceholder: '一个词……',
    wordBridgeVisitorEcho: '访客写了：',
    wordBridgeStaffEcho: '工作人员写了：',
    breatheTogether: '一起深呼吸',
    staffAckBtn: '我在这里 — 准备好一起确认',
    staffAckedBadge: '✓ 工作人员已看到你的请求',
    staffCheckingMeaning: '工作人员正在确认您的意思',
    staffVerifyPrompt: '这是您想表达的意思吗？',
    customerConfirmYes: '对，就是这个意思',
    customerConfirmNo: '不太对 — 让我再解释',
    customerHasConfirmed: '访客已确认 ✓',
    waitingConfirmation: '等待访客确认……',
  },
  yue: {
    appSubtitle: '一個幫助日常服務對話互相理解嘅工具。',
    chooseView: '揀你嘅視角', chooseLanguage: '揀你嘅語言',
    customerTitle: '訪客 / 使用者', customerDesc: '我想查詢資料或者尋求幫助。',
    staffTitle: '職員', staffDesc: '我幫緊訪客了解服務。',
    enterCustomer: '進入訪客視角', enterStaff: '進入職員視角',
    selectLangFirst: '請先揀語言。', changeLang: '語言', closePanel: '關閉',
    cs1Title: '今日你想了解乜嘢？', cs1Inst: '揀一個或多個。之後可以更改。',
    next: '下一步', back: '返回',
    cs2Title: '點樣溝通會舒服啲？', cs2Inst: '可選。揀令對話更清晰嘅選項。',
    cs3Title: '同職員溝通之前',
    lookingFor: '你想搵：', convPrefs: '對話偏好：',
    noPrefSelected: '冇選偏好', doesLookRight: '呢啲資料係咪啱？',
    shareWithStaff: '分享俾職員', edit: '修改',
    sharedSuccess: '職員已經睇到你嘅資料。',
    goStaffView: '去職員視角', continueCustomer: '繼續訪客操作',
    cs4Title: '對話過程中',
    cs4Sub: '如果有咩唔清楚，可以用意思確認或恢復提示。',
    feelMisunderstood: '我覺得對方誤解咗我', feelStuck: '我卡住咗',
    change: '更改', sendSignal: '向職員發送恢復信號',
    signalSent: '恢復信號已發送', viewStaffResp: '睇職員回應',
    editSentence: '編輯句子', cancel: '取消',
    seeNextStep: '睇下一步總結 →',
    canSayThis: '你可以講呢句話、修改佢或者忽略佢。',
    cs5Title: '我哋嘅理解係', suggestedNextSteps: '建議嘅下一步：', done: '完成 ✓',
    activities: '搵本地活動', meet: '識新朋友', english: '練英文',
    form: '填表或睇表格', housing: '住屋問題', health: '醫療或診所問題',
    notsure: '唔確定', other: '其他',
    slow: '請講慢啲', onequestion: '請一次問一個問題',
    time: '我可能需要時間解釋', writesteps: '請幫我寫低下一步',
    chinese: '我有啲詞可能會用廣東話', nopref: '冇特別偏好',
    notmean: '唔係我嘅意思', another: '我想換一種方式解釋',
    social: '社交活動，唔係單係課程',
    moretime: '我需要多啲時間諗', cantexplain: '我唔知點用英文解釋',
    tryagain: '我想再試一次',
    liveInterpTitle: '即時傳譯', liveInterpToggle: '🌐 傳譯',
    liveInterpActive: '● 傳譯中', liveInterpOff: '關閉',
    liveInterpInput: '用你嘅語言輸入 — 職員會見到你嘅訊息。',
    liveInterpOutputLabel: '職員見到：', liveInterpTyping: '訪客正在輸入…',
    startLbl: '開始',
    roleTagline: '讓意思喺唔完整嘅英語之外展開。',
    visitorSharedBadge: '訪客已分享佢嘅請求',
    visitorLanguageLbl: '訪客嘅語言：',
    visitorFeelingMisunderstood: '訪客覺得俾人誤解咗。',
    visitorFeelingStuck: '訪客覺得卡住咗。',
    sentToVisitor: '已發送俾訪客',
    sharedWithStaff: '已分享俾職員',
    switchToStaffNote: '切換去職員視角，睇睇職員點樣接收呢啲資料。',
    suggestedSentence: '建議嘅句子', updatedFromStaff: '來自職員嘅更新',
    closingTitle: 'MeaningBloom 幫助咗呢次對話。',
    closingAffirm1: '意思已澄清', closingAffirm2: '訪客保持咗主導', closingAffirm3: '下一步已清晰',
    closingLine1: '目標唔係完美嘅英語。',
    closingLine2: '目標係更完整嘅表達、更好嘅理解，同一段可以繼續嘅對話。',
    connectVisitor: '訪客', connectStaff: '職員',
    saveLbl: '儲存', textMeLbl: '發短訊', printLbl: '打印',
    ss1Title: '職員視角', ss2Title: '佢哋可能係乜意思？', ss3Title: '循環需要修復',
    ss4Title: '結束循環', meaningConfTitle: '一齊確認咗意思', meaningConfLabel: '確認嘅意思：',
    suggestedOpening: '開啟循環：', useDashboard: '講出嚟 — 然後聆聽。去驗證，唔好假設。',
    visitorLookingFor: '佢哋同你分享嘅：', convPrefsStaff: '佢哋希望嘅溝通方式：',
    ss2Sub: '選擇符合嘅意思 — 然後大聲講出短語，一齊確認。',
    ss2Note: '澄清唔係糾正 — 而係更仔細咁聆聽。',
    basedOnRequest: '根據訪客嘅分享，佢哋可能喺搵：',
    staffPhrase: '講出嚟確認：', confirmMeaning: '確認意思',
    backToDash: '← 返回',
    visitorNeedsSup: '訪客需要：',
    suggestedStaffResp: '講呢句話幫佢哋返嚟：', generalGuidance: '循環修復工具 — 揀一個：',
    hereIsUnderstood: '你哋一齊確認嘅：', nextStepsLabel: '要同佢哋分享嘅步驟：',
    sendToCustomer: '發送俾訪客 — 結束循環', summarySent: '循環已結束 · 摘要已同訪客分享',
    writeDown: '✦ 寫低、發短訊或打印俾訪客帶走。',
    noRequestYet: '循環已開啟。', noRequestSub: '等待訪客完成意思確認。',
    switchCustomer: '切換去訪客視角', recoveryAlert: '循環中斷',
    clearloopPrinciple: '佢哋嘅意思比說法更重要。',
    dontAssume: '去驗證，唔好假設。',
    loopRepairIntro: '循環失去咗連接。以下係如何重新建立。',
    loopStatus: 'ClearLoop · 意思確認',
    sharedMeaningNote: '呢個係你哋一齊確認嘅。',
    tabSubCheck: '確認之前', tabSubRepairIdle: '如果連接中斷',
    tabSubRepairActive: '已收到信號', tabSubClose: '建立共同摘要',
    meaningVerifiedNote: '你哋一齊確認咗意思。循環保持連接。',
    selectMeaningsHint: '請喺上方選擇意思嚟建立短語。',
    beforeYouBegin: '開始之前：', listenFirst: '先聽完。讓佢講完。',
    doNotGuess: '唔好猜或者替佢說完句子。',
    checkMeaningGently: '輕柔地確認意思，而唔係糾正。',
    giveTime: '俾訪客時間。唔好催。', doNotFinish: '唔好幫佢講完句子。',
    askOneQStaff: '一次只問一個問題。',
    staffNoteTime: '猜測之前俾訪客時間。',
    staffNoteWritesteps: '訪客離開前寫低下一步。',
    staffNoteChinese: '訪客可能會用母語講幾個詞。',
    sfiVisitor: '訪客已分享', sfiStaff: '職員理解', sfiShared: '共同理解',
    meaningVisitorLabel: '訪客', meaningStaffLabel: '職員',
    checkMeaningNav: '確認意思', recoverySupportNav: '修復循環',
    createSummaryNav: '結束循環',
    staffAckBtn: '我喺度 — 準備好一齊確認',
    staffAckedBadge: '✓ 職員已睇到你嘅請求',
    staffCheckingMeaning: '職員正在確認您的意思',
    staffVerifyPrompt: '呢個係您嘅意思嗎？',
    customerConfirmYes: '係，就係呢個意思',
    customerConfirmNo: '唔係 — 我再解釋一下',
    customerHasConfirmed: '訪客已確認 ✓',
    waitingConfirmation: '等待訪客確認……',
    visitorFeelingMisunderstood: '佢哋覺得自己嘅意思未被理解。',
    visitorFeelingStuck: '佢哋感到卡住咗 — 循環需要修復。',
    ns1: '星期六社區午餐', ns2: '初級行路小組', ns3: '本地義工活動',
  },
  es: {
    appSubtitle: 'Un sistema para verificar el entendimiento en conversaciones cotidianas.',
    chooseView: 'Elige tu vista', chooseLanguage: 'Elige tu idioma',
    customerTitle: 'Cliente / Visitante', customerDesc: 'Estoy aquí para pedir ayuda o información.',
    staffTitle: 'Personal', staffDesc: 'Estoy ayudando a los visitantes a entender los servicios.',
    enterCustomer: 'Entrar como Cliente', enterStaff: 'Entrar como Personal',
    connected: 'Ambas vistas están conectadas.',
    selectLangFirst: 'Por favor selecciona un idioma primero.',
    changeLang: 'Idioma', closePanel: 'Cerrar',
    cs1Title: '¿Qué te trae aquí hoy?', cs1Inst: 'Elige uno o más. Puedes cambiar esto después.',
    next: 'Siguiente', back: 'Volver',
    cs2Title: '¿Qué haría esta conversación más fácil?',
    cs2Inst: 'Opcional. Elige lo que haría la conversación más clara.',
    cs3Title: 'Antes de conectarte con el personal',
    lookingFor: 'Estás buscando:', convPrefs: 'Preferencias de conversación:',
    noPrefSelected: 'Sin preferencia', doesLookRight: '¿Esto se ve correcto?',
    shareWithStaff: 'Compartir con el personal', edit: 'Editar',
    sharedSuccess: 'Tu solicitud ha sido compartida con el personal.',
    goStaffView: 'Ir al Personal', continueCustomer: 'Continuar como Cliente',
    cs4Title: 'Durante la conversación',
    cs4Sub: 'Si algo no está claro, usa una verificación de significado.',
    feelMisunderstood: 'Me siento malentendido/a', feelStuck: 'Me siento bloqueado/a',
    change: 'Cambiar', sendSignal: 'Enviar señal al personal',
    signalSent: 'Señal enviada al personal', viewStaffResp: 'Ver respuesta',
    editSentence: 'Editar oración', cancel: 'Cancelar',
    seeNextStep: 'Ver el resumen del próximo paso →',
    canSayThis: 'Puedes decir esto, editarlo o ignorarlo.',
    cs5Title: 'Esto es lo que entendimos', suggestedNextSteps: 'Próximos pasos:', done: 'Listo ✓',
    activities: 'Encontrar actividades locales', meet: 'Conocer personas',
    english: 'Practicar inglés', form: 'Ayuda con un formulario',
    housing: 'Vivienda o apartamento', health: 'Atención médica',
    notsure: 'No estoy seguro/a', other: 'Algo más',
    slow: 'Por favor habla despacio', onequestion: 'Haz una pregunta a la vez',
    time: 'Puede que necesite tiempo', writesteps: 'Escribe los próximos pasos',
    chinese: 'Puedo usar palabras en mi idioma', nopref: 'Sin preferencia',
    notmean: 'Eso no es lo que quiero decir', another: 'Quiero explicarlo de otra manera',
    social: 'Actividades sociales, no solo clases',
    moretime: 'Necesito más tiempo para pensar', cantexplain: 'No sé cómo explicarlo en inglés',
    tryagain: 'Quiero intentarlo de nuevo',
    liveInterpTitle: 'Interpretación en vivo', liveInterpToggle: '🌐 Interpretar',
    liveInterpActive: '● En vivo', liveInterpOff: 'Apagar',
    liveInterpInput: 'Escribe en tu idioma — el personal verá tu mensaje.',
    liveInterpOutputLabel: 'El personal ve:', liveInterpTyping: 'El visitante está escribiendo…',
    startLbl: 'Inicio',
    roleTagline: 'Deja que el significado se despliegue más allá del inglés fragmentado.',
    visitorSharedBadge: 'El visitante ha compartido su solicitud',
    visitorLanguageLbl: 'Idioma del visitante:',
    visitorFeelingMisunderstood: 'El visitante se siente malentendido.',
    visitorFeelingStuck: 'El visitante se siente bloqueado.',
    sentToVisitor: 'Enviado al visitante',
    sharedWithStaff: 'Compartido con el personal',
    switchToStaffNote: 'Cambia a la vista del personal para ver cómo reciben esta información.',
    suggestedSentence: 'Frase sugerida', updatedFromStaff: 'Actualizado por el personal',
    closingTitle: 'MeaningBloom ayudó en esta conversación.',
    closingAffirm1: 'El significado fue aclarado', closingAffirm2: 'El visitante mantuvo el control', closingAffirm3: 'Los próximos pasos fueron claros',
    closingLine1: 'El objetivo no es el inglés perfecto.',
    closingLine2: 'El objetivo es una expresión más completa, mejor comprensión y una conversación que puede continuar.',
    connectVisitor: 'Visitante', connectStaff: 'Personal',
    saveLbl: 'Guardar', textMeLbl: 'Enviar mensaje', printLbl: 'Imprimir',
    ss1Title: 'Vista del personal', ss2Title: '¿Qué quieren decir probablemente?', ss3Title: 'El bucle necesita reparación',
    ss4Title: 'Cerrar el bucle', meaningConfTitle: 'Significado clarificado juntos', meaningConfLabel: 'Significado confirmado:',
    suggestedOpening: 'Abre el bucle con:', useDashboard: 'Dilo — luego escucha. Verifica, no supongas.',
    visitorLookingFor: 'Lo que compartieron contigo:', convPrefsStaff: 'Cómo prefieren comunicarse:',
    ss2Sub: 'Selecciona los significados que correspondan — luego di la frase en voz alta para verificar juntos.',
    ss2Note: 'Clarificar no es corregir — es escuchar con más atención.',
    basedOnRequest: 'Según lo que compartió el visitante, puede estar buscando:',
    staffPhrase: 'Di esto para verificar:', confirmMeaning: 'Confirmar significado',
    backToDash: '← Volver',
    visitorNeedsSup: 'El visitante necesita:',
    suggestedStaffResp: 'Di esto para traerlos de vuelta:', generalGuidance: 'Herramientas de reparación del bucle — usa una:',
    hereIsUnderstood: 'Lo que clarificaron juntos:', nextStepsLabel: 'Pasos para compartir con ellos:',
    sendToCustomer: 'Enviar al visitante — cerrar el bucle', summarySent: 'Bucle cerrado · Resumen compartido con el visitante',
    writeDown: '✦ Escríbelo, envíalo por mensaje o imprímelo para que el visitante se lo lleve.',
    noRequestYet: 'El bucle está abierto.', noRequestSub: 'Esperando que el visitante complete su verificación de significado.',
    switchCustomer: 'Cambiar a Vista del visitante', recoveryAlert: 'Bucle interrumpido',
    clearloopPrinciple: 'Lo que quieren decir importa más que cómo lo dijeron.',
    dontAssume: 'Verifica, no supongas.',
    loopRepairIntro: 'El bucle perdió la conexión. Así es cómo restaurarla.',
    loopStatus: 'ClearLoop · Verificación de significado',
    sharedMeaningNote: 'Esto es lo que clarificaron juntos.',
    tabSubCheck: 'antes de suponer', tabSubRepairIdle: 'si la conexión se rompe',
    tabSubRepairActive: 'señal recibida', tabSubClose: 'crear resumen compartido',
    meaningVerifiedNote: 'Verificaron el significado juntos. El bucle se mantiene.',
    selectMeaningsHint: 'Selecciona significados arriba para construir la frase.',
    beforeYouBegin: 'Antes de comenzar:', listenFirst: 'Escucha primero. Deja que terminen.',
    doNotGuess: 'No adivines ni completes su oración.',
    checkMeaningGently: 'Verifica el significado con calma, sin corregir.',
    giveTime: 'Dale tiempo al visitante. No te apresures.',
    doNotFinish: 'No termines su oración por ellos.',
    askOneQStaff: 'Haz una pregunta a la vez.',
    staffNoteTime: 'Dale tiempo al visitante antes de adivinar.',
    staffNoteWritesteps: 'Anota el próximo paso antes de que se vaya.',
    staffNoteChinese: 'El visitante puede usar palabras en su idioma.',
    sfiVisitor: 'Visitante compartió', sfiStaff: 'Personal entiende', sfiShared: 'Significado compartido',
    meaningVisitorLabel: 'Visitante', meaningStaffLabel: 'Personal',
    checkMeaningNav: 'Verificar significado', recoverySupportNav: 'Reparar el bucle',
    createSummaryNav: 'Cerrar el bucle',
    staffAckBtn: 'Estoy presente — listo/a para clarificar juntos',
    staffAckedBadge: '✓ El personal ha visto tu solicitud',
    staffCheckingMeaning: 'El personal está verificando tu significado',
    staffVerifyPrompt: '¿Es esto lo que quieres decir?',
    customerConfirmYes: 'Sí, eso es correcto',
    customerConfirmNo: 'No exactamente — déjame explicar',
    customerHasConfirmed: 'Visitante confirmó ✓',
    waitingConfirmation: 'Esperando confirmación del visitante…',
    visitorFeelingMisunderstood: 'Sienten que su significado no fue entendido.',
    visitorFeelingStuck: 'Se sienten atascados — el bucle necesita reparación.',
    ns1: 'Almuerzo comunitario del sábado', ns2: 'Grupo de caminata', ns3: 'Evento de voluntariado',
  },
  vi: {
    appSubtitle: 'Hệ thống kiểm tra hiểu biết chung cho các cuộc trò chuyện dịch vụ.',
    chooseView: 'Chọn chế độ xem', chooseLanguage: 'Chọn ngôn ngữ',
    customerTitle: 'Khách hàng / Khách thăm', customerDesc: 'Tôi đến để hỏi thông tin hoặc nhận hỗ trợ.',
    staffTitle: 'Nhân viên', staffDesc: 'Tôi đang giúp khách thăm hiểu về các dịch vụ.',
    enterCustomer: 'Vào Chế độ Khách hàng', enterStaff: 'Vào Chế độ Nhân viên',
    selectLangFirst: 'Vui lòng chọn ngôn ngữ trước.',
    changeLang: 'Ngôn ngữ', closePanel: 'Đóng',
    cs1Title: 'Hôm nay bạn cần gì?', cs1Inst: 'Chọn một hoặc nhiều. Bạn có thể thay đổi sau.',
    next: 'Tiếp theo', back: 'Quay lại',
    cs2Title: 'Điều gì giúp cuộc trò chuyện dễ hơn?',
    cs2Inst: 'Tùy chọn. Chọn bất cứ điều gì giúp rõ ràng hơn.',
    cs3Title: 'Trước khi kết nối với nhân viên',
    lookingFor: 'Bạn đang tìm:', convPrefs: 'Tùy chọn trò chuyện:',
    noPrefSelected: 'Không có tùy chọn', doesLookRight: 'Thông tin này có đúng không?',
    shareWithStaff: 'Chia sẻ với nhân viên', edit: 'Chỉnh sửa',
    sharedSuccess: 'Yêu cầu của bạn đã được chia sẻ.',
    goStaffView: 'Đến Nhân viên', continueCustomer: 'Tiếp tục là Khách hàng',
    cs4Title: 'Trong cuộc trò chuyện',
    cs4Sub: 'Nếu có điều gì không rõ, hãy dùng gợi ý phục hồi.',
    feelMisunderstood: 'Tôi cảm thấy bị hiểu nhầm', feelStuck: 'Tôi cảm thấy bị kẹt',
    change: 'Thay đổi', sendSignal: 'Gửi tín hiệu đến nhân viên',
    signalSent: 'Đã gửi tín hiệu', viewStaffResp: 'Xem phản hồi',
    editSentence: 'Chỉnh sửa câu', cancel: 'Hủy',
    seeNextStep: 'Xem bước tiếp theo →',
    canSayThis: 'Bạn có thể nói điều này, chỉnh sửa hoặc bỏ qua.',
    cs5Title: 'Đây là điều chúng tôi hiểu', suggestedNextSteps: 'Các bước tiếp theo:', done: 'Xong ✓',
    activities: 'Tìm hoạt động địa phương', meet: 'Gặp gỡ mọi người',
    english: 'Luyện tiếng Anh', form: 'Hỗ trợ điền biểu mẫu',
    housing: 'Nhà ở hoặc căn hộ', health: 'Chăm sóc sức khỏe',
    notsure: 'Chưa chắc', other: 'Điều khác',
    slow: 'Vui lòng nói chậm', onequestion: 'Hỏi một câu mỗi lần',
    time: 'Tôi cần thời gian giải thích', writesteps: 'Ghi các bước tiếp theo',
    chinese: 'Tôi có thể dùng ngôn ngữ của mình', nopref: 'Không có tùy chọn',
    notmean: 'Đó không phải ý tôi', another: 'Tôi muốn giải thích cách khác',
    social: 'Hoạt động xã hội, không chỉ lớp học',
    moretime: 'Tôi cần thêm thời gian', cantexplain: 'Không biết giải thích bằng tiếng Anh',
    tryagain: 'Tôi muốn thử lại',
    liveInterpTitle: 'Thông dịch trực tiếp', liveInterpToggle: '🌐 Thông dịch',
    liveInterpActive: '● Đang dịch', liveInterpOff: 'Tắt',
    liveInterpInput: 'Nhập bằng ngôn ngữ của bạn — nhân viên sẽ thấy tin nhắn của bạn.',
    liveInterpOutputLabel: 'Nhân viên thấy:', liveInterpTyping: 'Khách đang nhập…',
    startLbl: 'Bắt đầu',
    roleTagline: 'Để ý nghĩa mở ra vượt ra ngoài tiếng Anh không hoàn chỉnh.',
    visitorSharedBadge: 'Khách đã chia sẻ yêu cầu',
    visitorLanguageLbl: 'Ngôn ngữ của khách:',
    visitorFeelingMisunderstood: 'Khách cảm thấy bị hiểu nhầm.',
    visitorFeelingStuck: 'Khách cảm thấy bị kẹt.',
    sentToVisitor: 'Đã gửi cho khách',
    sharedWithStaff: 'Đã chia sẻ với nhân viên',
    switchToStaffNote: 'Chuyển sang giao diện nhân viên để xem cách nhân viên nhận thông tin này.',
    suggestedSentence: 'Câu gợi ý', updatedFromStaff: 'Được cập nhật từ nhân viên',
    closingTitle: 'MeaningBloom đã giúp ích cho cuộc trò chuyện này.',
    closingAffirm1: 'Ý nghĩa đã được làm rõ', closingAffirm2: 'Khách giữ quyền kiểm soát', closingAffirm3: 'Các bước tiếp theo đã rõ ràng',
    closingLine1: 'Mục tiêu không phải là tiếng Anh hoàn hảo.',
    closingLine2: 'Mục tiêu là diễn đạt đầy đủ hơn, hiểu biết tốt hơn và một cuộc trò chuyện có thể tiếp tục.',
    connectVisitor: 'Khách', connectStaff: 'Nhân viên',
    saveLbl: 'Lưu', textMeLbl: 'Nhắn tin', printLbl: 'In',
    ss1Title: 'Giao diện nhân viên', ss2Title: 'Họ có thể có ý gì?', ss3Title: 'Vòng lặp cần sửa',
    ss4Title: 'Đóng vòng lặp', meaningConfTitle: 'Ý nghĩa đã được làm rõ cùng nhau', meaningConfLabel: 'Ý nghĩa đã xác nhận:',
    suggestedOpening: 'Mở vòng lặp với:', useDashboard: 'Nói điều này — rồi lắng nghe. Xác minh, đừng giả định.',
    visitorLookingFor: 'Những gì họ đã chia sẻ với bạn:', convPrefsStaff: 'Cách họ muốn giao tiếp:',
    ss2Sub: 'Chọn các ý nghĩa phù hợp — sau đó nói câu to để xác nhận cùng nhau.',
    ss2Note: 'Làm rõ không phải là sửa lỗi — đó là lắng nghe kỹ hơn.',
    basedOnRequest: 'Dựa trên những gì khách chia sẻ, họ có thể đang tìm:',
    staffPhrase: 'Nói để xác nhận:', confirmMeaning: 'Xác nhận ý nghĩa',
    backToDash: '← Quay lại',
    visitorNeedsSup: 'Khách cần:',
    suggestedStaffResp: 'Nói điều này để đưa họ trở lại:', generalGuidance: 'Công cụ sửa vòng lặp — dùng một cái:',
    hereIsUnderstood: 'Những gì các bạn đã làm rõ cùng nhau:', nextStepsLabel: 'Các bước để chia sẻ với họ:',
    sendToCustomer: 'Gửi cho khách — đóng vòng lặp', summarySent: 'Vòng lặp đã đóng · Tóm tắt đã được chia sẻ',
    writeDown: '✦ Ghi lại, nhắn tin hoặc in cho khách mang về.',
    noRequestYet: 'Vòng lặp đã mở.', noRequestSub: 'Đang chờ khách hoàn tất kiểm tra ý nghĩa.',
    switchCustomer: 'Chuyển sang giao diện khách', recoveryAlert: 'Vòng lặp bị gián đoạn',
    clearloopPrinciple: 'Điều họ muốn nói quan trọng hơn cách họ nói.',
    dontAssume: 'Xác minh, đừng giả định.',
    loopRepairIntro: 'Vòng lặp đã mất kết nối. Đây là cách khôi phục.',
    loopStatus: 'ClearLoop · Kiểm tra ý nghĩa',
    sharedMeaningNote: 'Đây là những gì các bạn đã làm rõ cùng nhau.',
    tabSubCheck: 'trước khi đoán', tabSubRepairIdle: 'nếu kết nối bị gián đoạn',
    tabSubRepairActive: 'đã nhận tín hiệu', tabSubClose: 'tạo tóm tắt chung',
    meaningVerifiedNote: 'Các bạn đã xác nhận ý nghĩa cùng nhau. Vòng lặp được duy trì.',
    selectMeaningsHint: 'Chọn ý nghĩa ở trên để xây dựng câu.',
    beforeYouBegin: 'Trước khi bắt đầu:', listenFirst: 'Lắng nghe trước. Để họ nói xong.',
    doNotGuess: 'Đừng đoán hoặc nói thay câu của họ.',
    checkMeaningGently: 'Kiểm tra ý nghĩa nhẹ nhàng, không phán xét.',
    giveTime: 'Cho khách thăm thời gian. Đừng vội.',
    doNotFinish: 'Đừng nói thay câu cho họ.',
    askOneQStaff: 'Hỏi từng câu một.',
    staffNoteTime: 'Cho khách thời gian trước khi đoán.',
    staffNoteWritesteps: 'Ghi lại bước tiếp theo trước khi khách ra về.',
    staffNoteChinese: 'Khách có thể dùng một số từ tiếng mẹ đẻ.',
    sfiVisitor: 'Khách đã chia sẻ', sfiStaff: 'Nhân viên hiểu', sfiShared: 'Ý nghĩa chung',
    meaningVisitorLabel: 'Khách', meaningStaffLabel: 'Nhân viên',
    checkMeaningNav: 'Kiểm tra ý nghĩa', recoverySupportNav: 'Sửa vòng lặp',
    createSummaryNav: 'Đóng vòng lặp',
    staffAckBtn: 'Tôi ở đây — sẵn sàng làm rõ cùng nhau',
    staffAckedBadge: '✓ Nhân viên đã thấy yêu cầu của bạn',
    staffCheckingMeaning: 'Nhân viên đang xác minh ý của bạn',
    staffVerifyPrompt: 'Đây có phải là ý bạn muốn nói không?',
    customerConfirmYes: 'Đúng vậy',
    customerConfirmNo: 'Chưa đúng — để tôi giải thích thêm',
    customerHasConfirmed: 'Khách đã xác nhận ✓',
    waitingConfirmation: 'Đang chờ khách xác nhận…',
    visitorFeelingMisunderstood: 'Họ cảm thấy ý của mình không được hiểu.',
    visitorFeelingStuck: 'Họ cảm thấy bị kẹt — vòng lặp cần sửa.',
    ns1: 'Bữa trưa cộng đồng thứ Bảy', ns2: 'Nhóm đi bộ', ns3: 'Sự kiện tình nguyện',
  },
  tl: {
    appSubtitle: 'Isang sistema para sa pagkumpirma ng pag-unawa sa pang-araw-araw na usapan.',
    chooseView: 'Piliin ang iyong view', chooseLanguage: 'Piliin ang iyong wika',
    customerTitle: 'Customer / Bisita', customerDesc: 'Nandito ako para humingi ng tulong o impormasyon.',
    staffTitle: 'Kawani', staffDesc: 'Tinutulungan ko ang mga bisita.',
    enterCustomer: 'Pumasok bilang Customer', enterStaff: 'Pumasok bilang Kawani',
    selectLangFirst: 'Mangyaring pumili muna ng wika.',
    changeLang: 'Wika', closePanel: 'Isara',
    cs1Title: 'Ano ang dahilan ng iyong pagdating?', cs1Inst: 'Pumili ng isa o higit pa.',
    next: 'Susunod', back: 'Bumalik',
    cs2Title: 'Ano ang makakatulong sa pakikipag-usap?', cs2Inst: 'Opsyonal.',
    cs3Title: 'Bago kita ikonekta sa kawani',
    lookingFor: 'Hinahanap mo ang:', convPrefs: 'Mga kagustuhan:',
    noPrefSelected: 'Walang kagustuhan', doesLookRight: 'Tama ba ito?',
    shareWithStaff: 'Ibahagi sa kawani', edit: 'I-edit',
    sharedSuccess: 'Naibahagi na ang iyong kahilingan.',
    goStaffView: 'Pumunta sa Kawani', continueCustomer: 'Magpatuloy bilang Customer',
    cs4Title: 'Sa panahon ng usapan',
    cs4Sub: 'Kung may hindi malinaw, gumamit ng recovery prompt.',
    feelMisunderstood: 'Hindi ako naiintindihan', feelStuck: 'Natigil ako',
    change: 'Baguhin', sendSignal: 'Magpadala ng signal sa kawani',
    signalSent: 'Naipadala na ang signal', viewStaffResp: 'Tingnan ang tugon',
    editSentence: 'I-edit ang pangungusap', cancel: 'Kanselahin',
    seeNextStep: 'Tingnan ang susunod na hakbang →',
    canSayThis: 'Maaari mong sabihin ito, i-edit, o balewalain.',
    cs5Title: 'Ito ang aming naintindihan', suggestedNextSteps: 'Mga susunod na hakbang:', done: 'Tapos na ✓',
    activities: 'Maghanap ng lokal na aktibidad', meet: 'Makilala ang mga tao',
    english: 'Magsanay ng Ingles', form: 'Tulong sa form',
    housing: 'Tirahan o apartment', health: 'Pangangalagang pangkalusugan',
    notsure: 'Hindi pa sigurado', other: 'Iba pa',
    slow: 'Magsalita nang dahan-dahan', onequestion: 'Magtanong ng isa-isa',
    time: 'Kailangan ko ng oras', writesteps: 'Isulat ang mga susunod na hakbang',
    chinese: 'Maaari akong gumamit ng sariling wika', nopref: 'Walang kagustuhan',
    notmean: 'Hindi iyon ang ibig ko', another: 'Gusto kong ipaliwanag nang iba',
    social: 'Aktibidad panlipunan, hindi lang klase',
    moretime: 'Kailangan ko ng dagdag na oras', cantexplain: 'Hindi ko alam kung paano ipaliwanag',
    tryagain: 'Gusto kong subukang muli',
    liveInterpTitle: 'Live na Interpretasyon', liveInterpToggle: '🌐 I-interpret',
    liveInterpActive: '● Live', liveInterpOff: 'I-off',
    liveInterpInput: 'Mag-type sa iyong wika — makikita ng kawani ang iyong mensahe.',
    liveInterpOutputLabel: 'Nakikita ng kawani:', liveInterpTyping: 'Nag-ta-type ang bisita…',
    startLbl: 'Simula',
    roleTagline: 'Hayaang mabuklat ang kahulugan lampas sa sirang Ingles.',
    visitorSharedBadge: 'Ibinahagi na ng bisita ang kanilang kahilingan',
    visitorLanguageLbl: 'Wika ng bisita:',
    visitorFeelingMisunderstood: 'Ang bisita ay nakakaramdam na hindi naiintindihan.',
    visitorFeelingStuck: 'Ang bisita ay nakakaramdam na natigil.',
    sentToVisitor: 'Naipadala sa bisita',
    sharedWithStaff: 'Ibinahagi sa kawani',
    switchToStaffNote: 'Lumipat sa view ng kawani para makita kung paano nila natatanggap ang impormasyon.',
    suggestedSentence: 'Mungkahing pangungusap', updatedFromStaff: 'Na-update mula sa kawani',
    closingTitle: 'Nakatulong ang MeaningBloom sa pag-uusap na ito.',
    closingAffirm1: 'Nalinawan ang kahulugan', closingAffirm2: 'Napanatili ng bisita ang kontrol', closingAffirm3: 'Malinaw ang mga susunod na hakbang',
    closingLine1: 'Ang layunin ay hindi ang perpektong Ingles.',
    closingLine2: 'Ang layunin ay mas ganap na pagpapahayag, mas mabuting pag-unawa, at isang pag-uusap na maaaring magpatuloy.',
    connectVisitor: 'Bisita', connectStaff: 'Kawani',
    saveLbl: 'I-save', textMeLbl: 'Mag-text', printLbl: 'I-print',
    ss1Title: 'View ng Kawani', ss2Title: 'Ano ang malamang na ibig sabihin nila?', ss3Title: 'Kailangan ng pag-aayos ang loop',
    ss4Title: 'Isara ang loop', meaningConfTitle: 'Kahulugang nilinaw nang magkasama', meaningConfLabel: 'Nakumpirmang kahulugan:',
    suggestedOpening: 'Buksan ang loop gamit ang:', useDashboard: 'Sabihin ito — tapos makinig. I-verify, huwag mag-assume.',
    visitorLookingFor: 'Ang ibinahagi nila sa iyo:', convPrefsStaff: 'Kung paano nila nais makipag-usap:',
    ss2Sub: 'Piliin ang mga kahulugang akma — pagkatapos sabihin ang parirala nang malakas para ma-verify nang magkasama.',
    ss2Note: 'Ang paglilinaw ay hindi pagwawasto — ito ay mas malapit na pakikinig.',
    basedOnRequest: 'Batay sa ibinahagi ng bisita, maaari silang naghahanap ng:',
    staffPhrase: 'Sabihin upang ma-verify:', confirmMeaning: 'Kumpirmahin ang kahulugan',
    backToDash: '← Bumalik',
    visitorNeedsSup: 'Kailangan ng bisita:',
    suggestedStaffResp: 'Sabihin ito para ibalik sila:', generalGuidance: 'Mga tool sa pag-aayos ng loop — gumamit ng isa:',
    hereIsUnderstood: 'Ang nilinaw ninyo nang magkasama:', nextStepsLabel: 'Mga hakbang para ibahagi sa kanila:',
    sendToCustomer: 'Ipadala sa bisita — isara ang loop', summarySent: 'Loop sarado · Buod ibinahagi sa bisita',
    writeDown: '✦ Isulat ito, i-text, o i-print para dalhin ng bisita.',
    noRequestYet: 'Bukas na ang loop.', noRequestSub: 'Naghihintay sa bisita na makumpleto ang pagsusuri ng kahulugan.',
    switchCustomer: 'Lumipat sa View ng Bisita', recoveryAlert: 'Loop naputol',
    clearloopPrinciple: 'Ang ibig nilang sabihin ay mas mahalaga kaysa sa kung paano nila ito sinabi.',
    dontAssume: 'I-verify, huwag mag-assume.',
    loopRepairIntro: 'Nawala ang koneksyon ng loop. Narito kung paano ito ibalik.',
    loopStatus: 'ClearLoop · Pagsusuri ng Kahulugan',
    sharedMeaningNote: 'Ito ang nilinaw ninyo nang magkasama.',
    tabSubCheck: 'bago mag-assume', tabSubRepairIdle: 'kung mawala ang koneksyon',
    tabSubRepairActive: 'natanggap ang signal', tabSubClose: 'gumawa ng shared na buod',
    meaningVerifiedNote: 'Na-verify ninyo ang kahulugan nang magkasama. Nananatili ang loop.',
    selectMeaningsHint: 'Pumili ng mga kahulugan sa itaas para makabuo ng parirala.',
    beforeYouBegin: 'Bago magsimula:', listenFirst: 'Makinig muna. Hayaan silang matapos.',
    doNotGuess: 'Huwag hulaan o kumpletuhin ang kanilang pangungusap.',
    checkMeaningGently: 'Suriin ang kahulugan nang mahinahon, hindi nagtatama.',
    giveTime: 'Bigyan ang bisita ng oras. Huwag magmadali.',
    doNotFinish: 'Huwag tapusin ang kanilang pangungusap para sa kanila.',
    askOneQStaff: 'Magtanong ng isa-isa.',
    staffNoteTime: 'Bigyan ng oras ang bisita bago hulaan.',
    staffNoteWritesteps: 'Isulat ang susunod na hakbang bago umalis ang bisita.',
    staffNoteChinese: 'Maaaring gumamit ang bisita ng sariling wika.',
    sfiVisitor: 'Ibinahagi ng bisita', sfiStaff: 'Naintindihan ng kawani', sfiShared: 'Ibinabahaging kahulugan',
    meaningVisitorLabel: 'Bisita', meaningStaffLabel: 'Kawani',
    checkMeaningNav: 'Suriin ang kahulugan', recoverySupportNav: 'Ayusin ang loop',
    createSummaryNav: 'Isara ang loop',
    staffAckBtn: 'Nandito ako — handa na nating linawin nang magkasama',
    staffAckedBadge: '✓ Nakita na ng kawani ang iyong kahilingan',
    staffCheckingMeaning: 'Sinusuri ng kawani ang iyong kahulugan',
    staffVerifyPrompt: 'Ito ba ang ibig mong sabihin?',
    customerConfirmYes: 'Oo, tama iyan',
    customerConfirmNo: 'Hindi masyadо — hayaan akong ipaliwanag',
    customerHasConfirmed: 'Nakumpirma ng bisita ✓',
    waitingConfirmation: 'Naghihintay ng kumpirmasyon ng bisita…',
    visitorFeelingMisunderstood: 'Nararamdaman nilang hindi naiintindihan ang kanilang ibig sabihin.',
    visitorFeelingStuck: 'Nakakaramdam sila na natigil — kailangan ng pag-aayos ng loop.',
    ns1: 'Sabado na Tanghalian ng Komunidad', ns2: 'Pangkat ng Paglalakad', ns3: 'Kaganapan ng Boluntaryo',
  },
  ru: {
    appSubtitle: 'Система проверки взаимопонимания для повседневных разговоров.',
    chooseView: 'Выберите режим', chooseLanguage: 'Выберите язык',
    customerTitle: 'Клиент / Посетитель', customerDesc: 'Я пришёл за помощью или информацией.',
    staffTitle: 'Сотрудник', staffDesc: 'Я помогаю посетителям понять услуги.',
    enterCustomer: 'Войти как Клиент', enterStaff: 'Войти как Сотрудник',
    connected: 'Оба режима связаны. Выбор клиента влияет на вид сотрудника.',
    selectLangFirst: 'Пожалуйста, сначала выберите язык.',
    changeLang: 'Язык', closePanel: 'Закрыть',
    cs1Title: 'Что привело вас сюда?', cs1Inst: 'Выберите один или несколько вариантов.',
    next: 'Далее', back: 'Назад',
    cs2Title: 'Что поможет разговору быть понятнее?', cs2Inst: 'Необязательно.',
    cs3Title: 'Перед разговором с сотрудником',
    lookingFor: 'Вы ищете:', convPrefs: 'Предпочтения для разговора:',
    noPrefSelected: 'Предпочтения не выбраны', doesLookRight: 'Всё верно?',
    shareWithStaff: 'Поделиться с сотрудником', edit: 'Изменить',
    sharedSuccess: 'Ваш запрос передан сотруднику.',
    goStaffView: 'К сотруднику', continueCustomer: 'Продолжить как Клиент',
    cs4Title: 'Во время разговора',
    cs4Sub: 'Если что-то непонятно, используйте подсказку.',
    feelMisunderstood: 'Меня не поняли', feelStuck: 'Я в тупике',
    change: 'Изменить', sendSignal: 'Отправить сигнал сотруднику',
    signalSent: 'Сигнал отправлен', viewStaffResp: 'Посмотреть ответ',
    editSentence: 'Изменить фразу', cancel: 'Отмена',
    seeNextStep: 'Посмотреть следующие шаги →',
    canSayThis: 'Можете сказать это, изменить или проигнорировать.',
    cs5Title: 'Вот что мы поняли', suggestedNextSteps: 'Следующие шаги:', done: 'Готово ✓',
    activities: 'Найти местные мероприятия', meet: 'Познакомиться с людьми',
    english: 'Практика английского', form: 'Помощь с формой',
    housing: 'Жильё или квартира', health: 'Медицинская помощь',
    notsure: 'Ещё не уверен', other: 'Что-то другое',
    slow: 'Пожалуйста, говорите медленно', onequestion: 'Один вопрос за раз',
    time: 'Мне нужно время на объяснение', writesteps: 'Запишите следующие шаги',
    chinese: 'Могу использовать родной язык', nopref: 'Нет предпочтений',
    notmean: 'Это не то, что я имел в виду', another: 'Хочу объяснить по-другому',
    social: 'Социальные мероприятия, не только курсы',
    moretime: 'Нужно больше времени подумать', cantexplain: 'Не знаю как объяснить по-английски',
    tryagain: 'Хочу попробовать ещё раз',
    liveInterpTitle: 'Синхронный перевод', liveInterpToggle: '🌐 Перевод',
    liveInterpActive: '● В эфире', liveInterpOff: 'Выключить',
    liveInterpInput: 'Пишите на вашем языке — сотрудник увидит ваше сообщение.',
    liveInterpOutputLabel: 'Сотрудник видит:', liveInterpTyping: 'Посетитель печатает…',
    startLbl: 'Начало',
    roleTagline: 'Пусть смысл раскроется за пределами фрагментарного английского.',
    visitorSharedBadge: 'Посетитель поделился своим запросом',
    visitorLanguageLbl: 'Язык посетителя:',
    visitorFeelingMisunderstood: 'Посетитель чувствует, что его не поняли.',
    visitorFeelingStuck: 'Посетитель чувствует, что зашёл в тупик.',
    sentToVisitor: 'Отправлено посетителю',
    sharedWithStaff: 'Передано сотруднику',
    switchToStaffNote: 'Перейдите к виду сотрудника, чтобы увидеть, как сотрудник получает эту информацию.',
    suggestedSentence: 'Предложенная фраза', updatedFromStaff: 'Обновлено сотрудником',
    closingTitle: 'MeaningBloom помог этому разговору.',
    closingAffirm1: 'Смысл был прояснён', closingAffirm2: 'Клиент сохранил контроль', closingAffirm3: 'Следующие шаги были чёткими',
    closingLine1: 'Цель — не идеальный английский.',
    closingLine2: 'Цель — более полное выражение мыслей, лучшее понимание и разговор, который может продолжаться.',
    connectVisitor: 'Клиент', connectStaff: 'Сотрудник',
    saveLbl: 'Сохранить', textMeLbl: 'Отправить SMS', printLbl: 'Распечатать',
    ss1Title: 'Вид сотрудника', ss2Title: 'Что они, вероятно, имеют в виду?', ss3Title: 'Петля требует восстановления',
    ss4Title: 'Закрыть петлю', meaningConfTitle: 'Смысл прояснён вместе', meaningConfLabel: 'Подтверждённый смысл:',
    suggestedOpening: 'Откройте петлю с:', useDashboard: 'Скажите это — затем слушайте. Уточняйте, не предполагайте.',
    visitorLookingFor: 'Что они поделились с вами:', convPrefsStaff: 'Как им комфортнее общаться:',
    ss2Sub: 'Выберите подходящие значения — затем произнесите фразу вслух, чтобы подтвердить вместе.',
    ss2Note: 'Уточнение — это не исправление, а более внимательное слушание.',
    basedOnRequest: 'Исходя из того, что сообщил посетитель, он может искать:',
    staffPhrase: 'Скажите для подтверждения:', confirmMeaning: 'Подтвердить смысл',
    backToDash: '← Назад',
    visitorNeedsSup: 'Посетителю нужно:',
    suggestedStaffResp: 'Скажите это, чтобы вернуть их:', generalGuidance: 'Инструменты восстановления петли — выберите один:',
    hereIsUnderstood: 'Что вы прояснили вместе:', nextStepsLabel: 'Шаги для передачи им:',
    sendToCustomer: 'Отправить посетителю — закрыть петлю', summarySent: 'Петля закрыта · Памятка передана посетителю',
    writeDown: '✦ Запишите, отправьте сообщение или распечатайте для посетителя.',
    noRequestYet: 'Петля открыта.', noRequestSub: 'Ожидание посетителя для завершения проверки смысла.',
    switchCustomer: 'Перейти к виду посетителя', recoveryAlert: 'Петля прервана',
    clearloopPrinciple: 'То, что они имеют в виду, важнее того, как они это сказали.',
    dontAssume: 'Уточняйте, не предполагайте.',
    loopRepairIntro: 'Петля потеряла соединение. Вот как его восстановить.',
    loopStatus: 'ClearLoop · Проверка смысла',
    sharedMeaningNote: 'Это то, что вы прояснили вместе.',
    tabSubCheck: 'прежде чем предполагать', tabSubRepairIdle: 'если связь прервана',
    tabSubRepairActive: 'сигнал получен', tabSubClose: 'создать общую памятку',
    meaningVerifiedNote: 'Вы подтвердили смысл вместе. Петля сохраняется.',
    selectMeaningsHint: 'Выберите значения выше для построения фразы.',
    beforeYouBegin: 'Прежде чем начать:', listenFirst: 'Сначала слушайте. Дайте им договорить.',
    doNotGuess: 'Не угадывайте и не заканчивайте их предложения.',
    checkMeaningGently: 'Уточняйте смысл мягко, не исправляя.',
    giveTime: 'Дайте посетителю время. Не торопите.',
    doNotFinish: 'Не заканчивайте предложения за них.',
    askOneQStaff: 'Задавайте по одному вопросу за раз.',
    staffNoteTime: 'Дайте посетителю время, прежде чем угадывать.',
    staffNoteWritesteps: 'Запишите следующий шаг до ухода посетителя.',
    staffNoteChinese: 'Посетитель может использовать родной язык для некоторых слов.',
    sfiVisitor: 'Клиент поделился', sfiStaff: 'Сотрудник понимает', sfiShared: 'Общий смысл',
    meaningVisitorLabel: 'Клиент', meaningStaffLabel: 'Сотрудник',
    checkMeaningNav: 'Проверить смысл', recoverySupportNav: 'Восстановить петлю',
    createSummaryNav: 'Закрыть петлю',
    staffAckBtn: 'Я здесь — готов уточнить вместе',
    staffAckedBadge: '✓ Сотрудник увидел ваш запрос',
    staffCheckingMeaning: 'Сотрудник уточняет ваш смысл',
    staffVerifyPrompt: 'Это то, что вы имеете в виду?',
    customerConfirmYes: 'Да, всё верно',
    customerConfirmNo: 'Не совсем — позвольте объяснить',
    customerHasConfirmed: 'Клиент подтвердил ✓',
    waitingConfirmation: 'Ожидание подтверждения клиента…',
    visitorFeelingMisunderstood: 'Они чувствуют, что их смысл не был понят.',
    visitorFeelingStuck: 'Они чувствуют, что зашли в тупик — петля требует восстановления.',
    ns1: 'Общественный обед в субботу', ns2: 'Пешеходная группа', ns3: 'Волонтёрское мероприятие',
  },
}

/* ── Translation helpers ──────────────────── */
function t(key, lang) {
  return T[lang]?.[key] || T.en[key] || key
}

function getSecondary(optId, lang) {
  if (!lang || lang === 'en' || lang === 'other') return ''
  return T[lang]?.[optId] || ''
}

/* ── Bilingual display component ──────────── */
function Bi({ k, lang, tag: Tag = 'span' }) {
  const primary = T.en[k] || k
  const sec = lang && lang !== 'en' && lang !== 'other' ? T[lang]?.[k] || '' : ''
  return (
    <Tag>
      {primary}
      {sec && <span className="bi-sec">{sec}</span>}
    </Tag>
  )
}

/* ── Inline bilingual helper ─────────────── */
function BT({ k, lang }) {
  const en = T.en[k] || k
  const tr = (!lang || lang === 'en' || lang === 'other') ? '' : (T[lang]?.[k] || '')
  if (!tr) return <>{en}</>
  return <>{en}<span className="bt-tr">{tr}</span></>
}

/* ── Domain helpers ───────────────────────── */
function getMeaningOptions(selectedNeeds) {
  if (selectedNeeds.includes('activities') || selectedNeeds.includes('meet'))
    return MEANING_BY_CONTEXT.social
  if (selectedNeeds.includes('english')) return MEANING_BY_CONTEXT.english
  if (selectedNeeds.includes('housing')) return MEANING_BY_CONTEXT.housing
  return MEANING_BY_CONTEXT.default
}

function getSuggestedOpening(selectedNeeds) {
  if (selectedNeeds.includes('activities') && selectedNeeds.includes('meet'))
    return "I see you're looking for activities where you can meet people. Let's start there."
  if (selectedNeeds.includes('activities'))
    return "I see you're looking for local activities. Tell me more about what you have in mind."
  if (selectedNeeds.includes('meet'))
    return "I see you want to meet people. Let's find some opportunities together."
  if (selectedNeeds.includes('english'))
    return "I see you may be interested in English practice. Would you like classes, conversation groups, or casual activities?"
  if (selectedNeeds.includes('housing'))
    return "I see you have a housing or apartment question. Let's go one step at a time."
  if (selectedNeeds.includes('health'))
    return "I see you have a healthcare question. Let's find the right support for you."
  return "Thank you for checking in. Let's find out how I can help you today."
}

function getStaffRecoveryResponse(recoveryId) {
  const map = {
    moretime:    "Of course. Take your time.",
    cantexplain: "That's okay. You can use simple words first, and we can clarify together.",
    notmean:     "Thank you for telling me. Let's try again.",
    another:     "Thank you for letting me know. Please take your time to explain it differently.",
    social:      "I understand — you're looking for social activities, not just classes. Let's find the right options.",
    onequestion: "Of course. I'll ask one question at a time.",
    tryagain:    "Of course. Please take your time and try again.",
  }
  return map[recoveryId] || "Of course. Let's take it step by step."
}

function generateSummaryParts(selectedNeeds) {
  const parts = []
  if (selectedNeeds.includes('activities') || selectedNeeds.includes('meet'))
    parts.push('You are looking for social activities where you can meet people.')
  if (selectedNeeds.includes('english'))
    parts.push('You are also interested in English practice opportunities.')
  if (selectedNeeds.includes('housing'))
    parts.push('You may need help with housing or apartment questions.')
  if (selectedNeeds.includes('health'))
    parts.push('You are looking for information about healthcare or clinics.')
  if (selectedNeeds.includes('form'))
    parts.push('You may need help understanding or filling out a form.')
  if (parts.length === 0)
    parts.push("You're here to find the right information or support for your needs.")
  return parts
}

const NEXT_STEPS = [
  { n: 1, id: 'ns1', en: 'Saturday Community Lunch', zh: '周六社区午餐',   emoji: '🍜' },
  { n: 2, id: 'ns2', en: 'Beginner Walking Group',   zh: '初级步行小组',   emoji: '🚶' },
  { n: 3, id: 'ns3', en: 'Local Volunteer Event',    zh: '本地志愿者活动', emoji: '🙌' },
]

/* ── Translation ──────────────────────────── */
const LANG_CODES = { en: 'en', zh: 'zh-CN', yue: 'zh-TW', es: 'es', vi: 'vi', tl: 'tl', ru: 'ru' }
/* BCP-47 codes for Web Speech API SpeechRecognition */
const SPEECH_LANG_CODES = {
  en: 'en-US', zh: 'zh-CN', yue: 'zh-HK',
  es: 'es-ES', vi: 'vi-VN', tl: 'fil-PH', ru: 'ru-RU', other: 'en-US',
}

/* ── World languages for "Other" expansion ── */
/* myMemory: ISO 639-1 (or -2) code accepted by MyMemory API   */
/* speech:   BCP-47 tag for Web SpeechRecognition              */
const WORLD_LANGUAGES = [
  // East / Southeast Asia
  { id:'ja', native:'日本語',        en:'Japanese',        myMemory:'ja',    speech:'ja-JP' },
  { id:'ko', native:'한국어',        en:'Korean',          myMemory:'ko',    speech:'ko-KR' },
  { id:'id', native:'Bahasa Indonesia', en:'Indonesian',   myMemory:'id',    speech:'id-ID' },
  { id:'ms', native:'Bahasa Melayu', en:'Malay',           myMemory:'ms',    speech:'ms-MY' },
  { id:'th', native:'ภาษาไทย',       en:'Thai',            myMemory:'th',    speech:'th-TH' },
  { id:'my', native:'မြန်မာဘာသာ',    en:'Burmese',         myMemory:'my',    speech:'my-MM' },
  { id:'km', native:'ភាសាខ្មែរ',      en:'Khmer',           myMemory:'km',    speech:'km-KH' },
  { id:'lo', native:'ພາສາລາວ',       en:'Lao',             myMemory:'lo',    speech:'lo-LA' },
  // South Asia
  { id:'hi', native:'हिन्दी',        en:'Hindi',           myMemory:'hi',    speech:'hi-IN' },
  { id:'bn', native:'বাংলা',         en:'Bengali',         myMemory:'bn',    speech:'bn-BD' },
  { id:'ur', native:'اردو',          en:'Urdu',            myMemory:'ur',    speech:'ur-PK' },
  { id:'pa', native:'ਪੰਜਾਬੀ',        en:'Punjabi',         myMemory:'pa',    speech:'pa-IN' },
  { id:'mr', native:'मराठी',         en:'Marathi',         myMemory:'mr',    speech:'mr-IN' },
  { id:'gu', native:'ગુજરાતી',       en:'Gujarati',        myMemory:'gu',    speech:'gu-IN' },
  { id:'ta', native:'தமிழ்',         en:'Tamil',           myMemory:'ta',    speech:'ta-IN' },
  { id:'te', native:'తెలుగు',        en:'Telugu',          myMemory:'te',    speech:'te-IN' },
  { id:'kn', native:'ಕನ್ನಡ',         en:'Kannada',         myMemory:'kn',    speech:'kn-IN' },
  { id:'si', native:'සිංහල',         en:'Sinhala',         myMemory:'si',    speech:'si-LK' },
  { id:'ne', native:'नेपाली',        en:'Nepali',          myMemory:'ne',    speech:'ne-NP' },
  // Middle East / Central Asia
  { id:'ar', native:'العربية',       en:'Arabic',          myMemory:'ar',    speech:'ar-SA' },
  { id:'fa', native:'فارسی',         en:'Persian',         myMemory:'fa',    speech:'fa-IR' },
  { id:'he', native:'עברית',         en:'Hebrew',          myMemory:'he',    speech:'he-IL' },
  { id:'tr', native:'Türkçe',        en:'Turkish',         myMemory:'tr',    speech:'tr-TR' },
  { id:'az', native:'Azərbaycan',    en:'Azerbaijani',     myMemory:'az',    speech:'az-AZ' },
  { id:'kk', native:'Қазақша',       en:'Kazakh',          myMemory:'kk',    speech:'kk-KZ' },
  { id:'uz', native:'Oʻzbekcha',     en:'Uzbek',           myMemory:'uz',    speech:'uz-UZ' },
  { id:'ky', native:'Кыргызча',      en:'Kyrgyz',          myMemory:'ky',    speech:'ky-KG' },
  { id:'ps', native:'پښتو',          en:'Pashto',          myMemory:'ps',    speech:'ps-AF' },
  { id:'ku', native:'Kurdî',         en:'Kurdish',         myMemory:'ku',    speech:'ku-TR' },
  // Europe — West
  { id:'fr', native:'Français',      en:'French',          myMemory:'fr',    speech:'fr-FR' },
  { id:'de', native:'Deutsch',       en:'German',          myMemory:'de',    speech:'de-DE' },
  { id:'pt', native:'Português',     en:'Portuguese',      myMemory:'pt',    speech:'pt-BR' },
  { id:'it', native:'Italiano',      en:'Italian',         myMemory:'it',    speech:'it-IT' },
  { id:'nl', native:'Nederlands',    en:'Dutch',           myMemory:'nl',    speech:'nl-NL' },
  { id:'sv', native:'Svenska',       en:'Swedish',         myMemory:'sv',    speech:'sv-SE' },
  { id:'no', native:'Norsk',         en:'Norwegian',       myMemory:'no',    speech:'nb-NO' },
  { id:'da', native:'Dansk',         en:'Danish',          myMemory:'da',    speech:'da-DK' },
  { id:'fi', native:'Suomi',         en:'Finnish',         myMemory:'fi',    speech:'fi-FI' },
  { id:'is', native:'Íslenska',      en:'Icelandic',       myMemory:'is',    speech:'is-IS' },
  { id:'ca', native:'Català',        en:'Catalan',         myMemory:'ca',    speech:'ca-ES' },
  { id:'gl', native:'Galego',        en:'Galician',        myMemory:'gl',    speech:'gl-ES' },
  { id:'cy', native:'Cymraeg',       en:'Welsh',           myMemory:'cy',    speech:'cy-GB' },
  { id:'ga', native:'Gaeilge',       en:'Irish',           myMemory:'ga',    speech:'ga-IE' },
  // Europe — East / South
  { id:'pl', native:'Polski',        en:'Polish',          myMemory:'pl',    speech:'pl-PL' },
  { id:'ro', native:'Română',        en:'Romanian',        myMemory:'ro',    speech:'ro-RO' },
  { id:'hu', native:'Magyar',        en:'Hungarian',       myMemory:'hu',    speech:'hu-HU' },
  { id:'cs', native:'Čeština',       en:'Czech',           myMemory:'cs',    speech:'cs-CZ' },
  { id:'sk', native:'Slovenčina',    en:'Slovak',          myMemory:'sk',    speech:'sk-SK' },
  { id:'hr', native:'Hrvatski',      en:'Croatian',        myMemory:'hr',    speech:'hr-HR' },
  { id:'bs', native:'Bosanski',      en:'Bosnian',         myMemory:'bs',    speech:'bs-BA' },
  { id:'sr', native:'Српски',        en:'Serbian',         myMemory:'sr',    speech:'sr-RS' },
  { id:'sl', native:'Slovenščina',   en:'Slovenian',       myMemory:'sl',    speech:'sl-SI' },
  { id:'bg', native:'Български',     en:'Bulgarian',       myMemory:'bg',    speech:'bg-BG' },
  { id:'mk', native:'Македонски',    en:'Macedonian',      myMemory:'mk',    speech:'mk-MK' },
  { id:'sq', native:'Shqip',         en:'Albanian',        myMemory:'sq',    speech:'sq-AL' },
  { id:'el', native:'Ελληνικά',      en:'Greek',           myMemory:'el',    speech:'el-GR' },
  { id:'uk', native:'Українська',    en:'Ukrainian',       myMemory:'uk',    speech:'uk-UA' },
  { id:'be', native:'Беларуская',    en:'Belarusian',      myMemory:'be',    speech:'be-BY' },
  { id:'et', native:'Eesti',         en:'Estonian',        myMemory:'et',    speech:'et-EE' },
  { id:'lv', native:'Latviešu',      en:'Latvian',         myMemory:'lv',    speech:'lv-LV' },
  { id:'lt', native:'Lietuvių',      en:'Lithuanian',      myMemory:'lt',    speech:'lt-LT' },
  { id:'ka', native:'ქართული',       en:'Georgian',        myMemory:'ka',    speech:'ka-GE' },
  { id:'hy', native:'Հայերեն',       en:'Armenian',        myMemory:'hy',    speech:'hy-AM' },
  { id:'mt', native:'Malti',         en:'Maltese',         myMemory:'mt',    speech:'mt-MT' },
  // Africa
  { id:'sw', native:'Kiswahili',     en:'Swahili',         myMemory:'sw',    speech:'sw-KE' },
  { id:'am', native:'አማርኛ',         en:'Amharic',         myMemory:'am',    speech:'am-ET' },
  { id:'so', native:'Soomaali',      en:'Somali',          myMemory:'so',    speech:'so-SO' },
  { id:'ha', native:'Hausa',         en:'Hausa',           myMemory:'ha',    speech:'ha-NG' },
  { id:'yo', native:'Yorùbá',        en:'Yoruba',          myMemory:'yo',    speech:'yo-NG' },
  { id:'ig', native:'Igbo',          en:'Igbo',            myMemory:'ig',    speech:'ig-NG' },
  { id:'af', native:'Afrikaans',     en:'Afrikaans',       myMemory:'af',    speech:'af-ZA' },
  { id:'zu', native:'isiZulu',       en:'Zulu',            myMemory:'zu',    speech:'zu-ZA' },
  { id:'xh', native:'isiXhosa',      en:'Xhosa',           myMemory:'xh',    speech:'xh-ZA' },
  { id:'mg', native:'Malagasy',      en:'Malagasy',        myMemory:'mg',    speech:'mg-MG' },
  // Americas / Pacific
  { id:'ht', native:'Kreyòl Ayisyen',en:'Haitian Creole',  myMemory:'ht',    speech:'ht-HT' },
  { id:'mi', native:'Māori',         en:'Māori',           myMemory:'mi',    speech:'mi-NZ' },
  // Central Asia / Other
  { id:'mn', native:'Монгол',        en:'Mongolian',       myMemory:'mn',    speech:'mn-MN' },
  { id:'tk', native:'Türkmen',       en:'Turkmen',         myMemory:'tk',    speech:'tk-TM' },
]

async function translateToEnglish(text, fromLang) {
  /* fromLang may be a LANG_CODES key ('zh') or a direct MyMemory code ('zh-CN', 'fr') */
  const from = LANG_CODES[fromLang] || fromLang
  if (!from || from === 'en' || from === 'en-US' || !text.trim()) return text
  try {
    const res = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from}|en`
    )
    const json = await res.json()
    const out = json.responseData?.translatedText || ''
    return out && out !== 'PLEASE SELECT TWO DISTINCT LANGUAGES' ? out : text
  } catch { return text }
}

async function translateFromEnglish(text, toLang) {
  /* toLang may be a LANG_CODES key ('zh') or a direct MyMemory code ('zh-CN', 'fr') */
  const to = LANG_CODES[toLang] || toLang
  if (!to || to === 'en' || to === 'en-US' || !text.trim()) return text
  try {
    const res = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${to}`
    )
    const json = await res.json()
    const out = json.responseData?.translatedText || ''
    return out && out !== 'PLEASE SELECT TWO DISTINCT LANGUAGES' ? out : text
  } catch { return text }
}

/* ── Ripple helper — attach to any button/card ── */
function useRipple(ref) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const handler = (e) => {
      const circle = document.createElement('span')
      circle.className = 'ripple-circle'
      const rect = el.getBoundingClientRect()
      circle.style.left = `${e.clientX - rect.left}px`
      circle.style.top  = `${e.clientY - rect.top}px`
      el.appendChild(circle)
      setTimeout(() => circle.remove(), 600)
    }
    el.addEventListener('pointerdown', handler)
    return () => el.removeEventListener('pointerdown', handler)
  }, [ref])
}

/* ── Ambient background layer (app-wide) ─── */
function AmbientField({ variant = 'warm' }) {
  return (
    <div className={`ambient-field ambient-field--${variant}`} aria-hidden="true">
      <div className="amb amb-1" />
      <div className="amb amb-2" />
      <div className="amb amb-3" />
      <div className="amb amb-4" />
    </div>
  )
}

/* ── Root App ─────────────────────────────── */
export default function App() {
  const [showSplash, setShowSplash] = useState(true)
  const [customerScreen, setCustomerScreen] = useState(0)
  const [staffScreen, setStaffScreen]       = useState(1)
  const [customerLanguage, setCustomerLanguage] = useState('en')
  const [staffLanguage, setStaffLanguage]       = useState('en')
  const [customerLangPanel, setCustomerLangPanel] = useState(false)
  const [staffLangPanel, setStaffLangPanel]       = useState(false)
  const [customerExtLang, setCustomerExtLang]     = useState(null) // { myMemory, speech, native, en }
  const [staffExtLang, setStaffExtLang]           = useState(null) // { native, en } — display only

  const [selectedNeeds, setSelectedNeeds]     = useState([])
  const [selectedPrefs, setSelectedPrefs]     = useState([])
  const [requestShared, setRequestShared]     = useState(false)
  const [customerBreakdown, setCustomerBreakdown] = useState(null)
  const [selectedRecovery, setSelectedRecovery]   = useState(null)
  const [recoverySignalSent, setRecoverySignalSent] = useState(false)
  const [editingPhrase, setEditingPhrase]   = useState(false)
  const [customPhrase, setCustomPhrase]     = useState('')
  const [selectedMeanings, setSelectedMeanings] = useState([])
  const [meaningConfirmed, setMeaningConfirmed] = useState(false)
  const [showMeaningCheck, setShowMeaningCheck] = useState(false)
  const [customerMeaningConfirmed, setCustomerMeaningConfirmed] = useState(false)
  const [staffSummaryShared, setStaffSummaryShared] = useState(false)
  const [staffAcknowledged, setStaffAcknowledged] = useState(false)
  const [staffWord, setStaffWord]       = useState('')
  const [visitorWord, setVisitorWord]   = useState('')
  const [breathingActive, setBreathingActive] = useState(false)
  const [liveInterp, setLiveInterp]             = useState(false)
  const [liveInterpText, setLiveInterpText]     = useState('')
  const [liveInterpTranslated, setLiveInterpTranslated] = useState('')
  const [translating, setTranslating]           = useState(false)
  const [staffReply, setStaffReply]             = useState('')
  const [staffReplyTranslated, setStaffReplyTranslated] = useState('')
  const [staffReplying, setStaffReplying]       = useState(false)
  const [dividerPulse, setDividerPulse]         = useState(false)
  const [mobileView, setMobileView]             = useState('customer')
  const prevShared = useRef(false)

  const toggleNeed = (id) =>
    setSelectedNeeds(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id])

  const toggleMeaning = (id) =>
    setSelectedMeanings(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id])

  const togglePref = (id) => {
    if (id === 'nopref') { setSelectedPrefs(['nopref']); return }
    setSelectedPrefs(p => {
      const without = p.filter(x => x !== 'nopref')
      return without.includes(id) ? without.filter(x => x !== id) : [...without, id]
    })
  }

  const resetAll = () => {
    setCustomerScreen(0); setStaffScreen(1)
    setCustomerLanguage('en'); setStaffLanguage('en')
    setCustomerLangPanel(false); setStaffLangPanel(false)
    setCustomerExtLang(null); setStaffExtLang(null)
    setSelectedNeeds([]); setSelectedPrefs([]); setRequestShared(false)
    setCustomerBreakdown(null); setSelectedRecovery(null); setRecoverySignalSent(false)
    setEditingPhrase(false); setCustomPhrase('')
    setSelectedMeanings([]); setMeaningConfirmed(false); setStaffSummaryShared(false)
    setStaffAcknowledged(false); setStaffWord(''); setVisitorWord(''); setBreathingActive(false)
    setLiveInterp(false); setLiveInterpText(''); setLiveInterpTranslated('')
    setStaffReply(''); setStaffReplyTranslated(''); setStaffReplying(false)
    prevShared.current = false
  }

  /* Pulse divider when request becomes shared */
  useEffect(() => {
    if (requestShared && !prevShared.current) {
      prevShared.current = true
      setDividerPulse(true)
      setTimeout(() => setDividerPulse(false), 1200)
    }
  }, [requestShared])

  /* Debounced live translation */
  useEffect(() => {
    if (!liveInterp || !liveInterpText.trim()) { setLiveInterpTranslated(''); return }
    /* Use extended language code (world lang) if set, else fall back to customerLanguage */
    const langCode = customerExtLang?.myMemory || customerLanguage
    if (!langCode || langCode === 'en' || langCode === 'other') {
      setLiveInterpTranslated(liveInterpText); return
    }
    const timer = setTimeout(async () => {
      setTranslating(true)
      const out = await translateToEnglish(liveInterpText, langCode)
      setLiveInterpTranslated(out)
      setTranslating(false)
    }, 600)
    return () => clearTimeout(timer)
  }, [liveInterpText, customerLanguage, customerExtLang, liveInterp])

  /* Debounced staff-reply → customer language translation */
  useEffect(() => {
    if (!liveInterp || !staffReply.trim()) { setStaffReplyTranslated(''); return }
    const langCode = customerExtLang?.myMemory || customerLanguage
    if (!langCode || langCode === 'en' || langCode === 'other') {
      setStaffReplyTranslated(staffReply); return
    }
    const timer = setTimeout(async () => {
      setStaffReplying(true)
      const out = await translateFromEnglish(staffReply, langCode)
      setStaffReplyTranslated(out)
      setStaffReplying(false)
    }, 600)
    return () => clearTimeout(timer)
  }, [staffReply, customerLanguage, customerExtLang, liveInterp])

  const allRecoveryOptions = [...RECOVERY_MISUNDERSTOOD, ...RECOVERY_STUCK]
  const recoveryOpt   = allRecoveryOptions.find(o => o.id === selectedRecovery)
  const currentPhrase = editingPhrase ? customPhrase : (recoveryOpt?.phrase ?? '')

  /* On mobile: auto-switch to visitor panel when staff sends a meaning check */
  useEffect(() => {
    if (showMeaningCheck) setMobileView('customer')
  }, [showMeaningCheck])

  if (showSplash) return <SplashScreen onEnter={() => setShowSplash(false)} />

  /* ── Table layout — both panels always visible ── */
  return (
    <div className="table-root">
      <AmbientField variant="warm" />

      {/* ── Mobile tab switcher (hidden on desktop) ── */}
      <div className="mobile-tabs" role="tablist">
        <button
          role="tab"
          aria-selected={mobileView === 'customer'}
          className={`mobile-tab ${mobileView === 'customer' ? 'mobile-tab--active' : ''}`}
          onClick={() => setMobileView('customer')}
        >
          <span className="mobile-tab-icon">👤</span>
          <span>Visitor</span>
        </button>
        <button
          role="tab"
          aria-selected={mobileView === 'staff'}
          className={`mobile-tab ${mobileView === 'staff' ? 'mobile-tab--active' : ''}`}
          onClick={() => setMobileView('staff')}
        >
          <span className="mobile-tab-icon">🧑‍💼</span>
          <span>Staff</span>
        </button>
      </div>

      {/* ── Customer panel (left) ── */}
      <div className={`t-panel t-panel--customer${mobileView !== 'customer' ? ' mobile-panel-hidden' : ''}`}>
        <PanelNav
          role="customer" lang={customerLanguage}
          liveInterp={liveInterp}
          onToggleLiveInterp={() => { setLiveInterp(p => !p); setLiveInterpText(''); setLiveInterpTranslated('') }}
          showLangPanel={customerLangPanel}
          onChangeLang={() => setCustomerLangPanel(p => !p)}
        />
        {customerLangPanel && (
          <LangPanel currentLang={customerLanguage}
            onSelect={l => { setCustomerLanguage(l); setCustomerLangPanel(false) }}
            onClose={() => setCustomerLangPanel(false)} />
        )}
        {/* LiveInterpPanel is only shown in the helper-screens flow, not in full interp mode */}
        {liveInterp && customerScreen !== -1 && (
          <LiveInterpPanel
            lang={customerLanguage}
            speechLang={customerExtLang?.speech || SPEECH_LANG_CODES[customerLanguage] || 'en-US'}
            nativeLangLabel={customerExtLang?.native}
            text={liveInterpText}
            setText={setLiveInterpText}
            translatedText={liveInterpTranslated}
            translating={translating}
            onClose={() => { setLiveInterp(false); setLiveInterpText(''); setLiveInterpTranslated('') }}
          />
        )}
        <div className="t-screen">
          {customerScreen === 0 && (
            <CS0
              onSelectLang={(langId, extLang) => {
                setCustomerLanguage(langId)
                setCustomerExtLang(extLang || null)
              }}
              onStart={(interpOn) => {
                if (interpOn) {
                  setLiveInterp(true)
                  setCustomerScreen(-1)
                } else {
                  setLiveInterp(false)
                  setCustomerScreen(1)
                }
              }}
              currentLang={customerLanguage}
              customerExtLang={customerExtLang}
            />
          )}
          {customerScreen === -1 && (
            <CSInterp
              lang={customerLanguage}
              speechLang={customerExtLang?.speech || SPEECH_LANG_CODES[customerLanguage] || 'en-US'}
              nativeLangLabel={customerExtLang?.native || LANGUAGES.find(l => l.id === customerLanguage)?.native}
              text={liveInterpText}
              setText={setLiveInterpText}
              translatedText={liveInterpTranslated}
              translating={translating}
              onGoToHelp={() => setCustomerScreen(1)}
              staffReply={staffReply}
              staffReplyTranslated={staffReplyTranslated}
              staffReplying={staffReplying}
            />
          )}
          {customerScreen === 1 && (
            <CS1 goTo={setCustomerScreen} selectedNeeds={selectedNeeds}
              toggleNeed={toggleNeed} lang={customerLanguage} />
          )}
          {customerScreen === 2 && (
            <CS2 goTo={setCustomerScreen} selectedPrefs={selectedPrefs}
              togglePref={togglePref} lang={customerLanguage} />
          )}
          {customerScreen === 3 && (
            <CS3 goTo={setCustomerScreen} selectedNeeds={selectedNeeds}
              selectedPrefs={selectedPrefs} requestShared={requestShared}
              onShare={() => setRequestShared(true)}
              onGoStaff={() => setStaffScreen(1)}
              lang={customerLanguage} />
          )}
          {customerScreen === 4 && (
            <CS4 goTo={setCustomerScreen} requestShared={requestShared}
              customerBreakdown={customerBreakdown} setCustomerBreakdown={setCustomerBreakdown}
              selectedRecovery={selectedRecovery} setSelectedRecovery={setSelectedRecovery}
              recoverySignalSent={recoverySignalSent} setRecoverySignalSent={setRecoverySignalSent}
              recoveryOpt={recoveryOpt} currentPhrase={currentPhrase}
              editingPhrase={editingPhrase} setEditingPhrase={setEditingPhrase}
              customPhrase={customPhrase} setCustomPhrase={setCustomPhrase}
              onViewStaff={() => setStaffScreen(3)}
              staffAcknowledged={staffAcknowledged}
              visitorWord={visitorWord} setVisitorWord={setVisitorWord}
              staffWord={staffWord}
              breathingActive={breathingActive} setBreathingActive={setBreathingActive}
              lang={customerLanguage} />
          )}
          {customerScreen === 5 && (
            <CS5 selectedNeeds={selectedNeeds} staffSummaryShared={staffSummaryShared}
              resetAll={resetAll} lang={customerLanguage} />
          )}
          {showMeaningCheck && !customerMeaningConfirmed && requestShared && (
            <CSMeaningCheck
              selectedNeeds={selectedNeeds}
              selectedMeanings={selectedMeanings}
              lang={customerLanguage}
              onConfirm={() => { setCustomerMeaningConfirmed(true); setShowMeaningCheck(false) }}
              onNotQuite={() => { setShowMeaningCheck(false); setMeaningConfirmed(false) }}
            />
          )}
        </div>
      </div>

      {/* ── Center divider ── */}
      <div className={`t-divider ${dividerPulse ? 't-divider--pulse' : ''}`}>
        <div className="t-div-line t-div-line--top" />
        <div className="t-bloom-hub" aria-hidden="true">
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <circle cx="18" cy="18" r="4" fill="#5e9070" opacity="0.9"/>
            <ellipse cx="18" cy="10" rx="3" ry="6" fill="#5e9070" opacity="0.38" transform="rotate(0 18 18)"/>
            <ellipse cx="18" cy="10" rx="3" ry="6" fill="#5e9070" opacity="0.34" transform="rotate(60 18 18)"/>
            <ellipse cx="18" cy="10" rx="3" ry="6" fill="#5e9070" opacity="0.34" transform="rotate(120 18 18)"/>
            <ellipse cx="18" cy="10" rx="3" ry="6" fill="#5e9070" opacity="0.30" transform="rotate(180 18 18)"/>
            <ellipse cx="18" cy="10" rx="3" ry="6" fill="#5e9070" opacity="0.30" transform="rotate(240 18 18)"/>
            <ellipse cx="18" cy="10" rx="3" ry="6" fill="#5e9070" opacity="0.34" transform="rotate(300 18 18)"/>
          </svg>
        </div>

        {liveInterp && (
          <div className="t-interp-center">
            <div className={`t-ic-bubble t-ic-bubble--visitor ${liveInterpText ? 't-ic-bubble--has-text' : ''}`}>
              {liveInterpText
                ? <span>{liveInterpText}</span>
                : <span className="t-ic-idle">{t('liveInterpTyping', customerLanguage)}</span>
              }
            </div>
            <div className="t-ic-arrow" aria-hidden="true">↓</div>
            <div className={`t-ic-bubble t-ic-bubble--staff ${liveInterpTranslated ? 't-ic-bubble--has-text' : ''}`}>
              {translating
                ? <span className="t-ic-dots"><span/><span/><span/></span>
                : liveInterpTranslated
                  ? <span>{liveInterpTranslated}</span>
                  : <span className="t-ic-idle">…</span>
              }
            </div>
          </div>
        )}

        {!liveInterp && requestShared && (
          <div className="t-shared-indicator">
            <span className="t-shared-dot" />
          </div>
        )}

        {/* Word Bridge — both sides contribute a word */}
        {requestShared && !liveInterp && (
          <div className="t-word-bridge">
            <div className={`t-wb-word t-wb-word--visitor ${visitorWord ? 't-wb-word--filled' : ''}`}>
              {visitorWord || '…'}
            </div>
            <div className="t-wb-connector" aria-hidden="true">⇄</div>
            <div className={`t-wb-word t-wb-word--staff ${staffWord ? 't-wb-word--filled' : ''}`}>
              {staffWord || '…'}
            </div>
          </div>
        )}

        {/* Breathing sync orb */}
        {breathingActive && (
          <div className="t-breath-orb" title="Breathing together…" aria-label="Breathing exercise active" />
        )}

        <div className="t-div-line t-div-line--bottom" />
        <button className="t-reset-btn" onClick={resetAll} title="Reset session">⟳</button>
      </div>

      {/* ── Staff panel (right) ── */}
      <div className={`t-panel t-panel--staff${mobileView !== 'staff' ? ' mobile-panel-hidden' : ''}`}>
        <PanelNav
          role="staff" lang={staffLanguage} extLang={staffExtLang}
          showLangPanel={staffLangPanel}
          onChangeLang={() => setStaffLangPanel(p => !p)}
        />
        {staffLangPanel && (
          <LangPanel currentLang={staffLanguage} extLang={staffExtLang}
            onSelect={(langId, ext) => {
              setStaffLanguage(langId)
              setStaffExtLang(ext || null)
              setStaffLangPanel(false)
            }}
            onClose={() => setStaffLangPanel(false)} />
        )}
        <div className="t-screen">
          {staffScreen === 1 && (
            <SS1 goTo={setStaffScreen} selectedNeeds={selectedNeeds}
              selectedPrefs={selectedPrefs} requestShared={requestShared}
              recoverySignalSent={recoverySignalSent}
              onSwitchToCustomer={() => setCustomerScreen(0)}
              lang={staffLanguage} customerLang={customerLanguage}
              liveInterp={liveInterp} liveInterpText={liveInterpTranslated || liveInterpText}
              onAcknowledge={() => setStaffAcknowledged(true)}
              staffWord={staffWord} setStaffWord={setStaffWord}
              visitorWord={visitorWord}
              breathingActive={breathingActive} setBreathingActive={setBreathingActive}
              staffReply={staffReply} setStaffReply={setStaffReply}
              staffReplyTranslated={staffReplyTranslated} staffReplying={staffReplying} />
          )}
          {staffScreen === 2 && (
            <SS2 goTo={setStaffScreen} selectedNeeds={selectedNeeds}
              selectedMeanings={selectedMeanings} toggleMeaning={toggleMeaning}
              meaningConfirmed={meaningConfirmed} setMeaningConfirmed={setMeaningConfirmed}
              onConfirm={() => { setStaffAcknowledged(true); setShowMeaningCheck(true); setCustomerMeaningConfirmed(false) }}
              customerMeaningConfirmed={customerMeaningConfirmed}
              showMeaningCheck={showMeaningCheck}
              lang={staffLanguage} />
          )}
          {staffScreen === 3 && (
            <SS3 goTo={setStaffScreen} recoverySignalSent={recoverySignalSent}
              recoveryOpt={recoveryOpt} customerBreakdown={customerBreakdown}
              lang={staffLanguage} customerLang={customerLanguage} />
          )}
          {staffScreen === 4 && (
            <SS4 goTo={setStaffScreen} selectedNeeds={selectedNeeds}
              staffSummaryShared={staffSummaryShared}
              onSendToCustomer={() => { setStaffSummaryShared(true); setCustomerScreen(5) }}
              lang={staffLanguage} />
          )}
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   Screen 0 — Role + Language Selection
───────────────────────────────────────────── */
function RoleSelection({ onSelectRole }) {
  const [pendingLang, setPendingLang] = useState(null)
  const [error, setError] = useState(false)
  const lang = pendingLang || 'en'

  const handleEnter = (role) => {
    if (!pendingLang) { setError(true); return }
    onSelectRole(role, pendingLang)
  }

  return (
    <div className="role-selection">
      {/* Brand header */}
      <div className="role-header">
        <div className="role-bloom-mark" aria-hidden="true">
          <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
            <circle cx="26" cy="26" r="5" fill="#5e9070" opacity="0.9"/>
            <ellipse cx="26" cy="14" rx="4" ry="7" fill="#5e9070" opacity="0.5" transform="rotate(0 26 26)"/>
            <ellipse cx="26" cy="14" rx="4" ry="7" fill="#5e9070" opacity="0.45" transform="rotate(60 26 26)"/>
            <ellipse cx="26" cy="14" rx="4" ry="7" fill="#5e9070" opacity="0.45" transform="rotate(120 26 26)"/>
            <ellipse cx="26" cy="14" rx="4" ry="7" fill="#5e9070" opacity="0.40" transform="rotate(180 26 26)"/>
            <ellipse cx="26" cy="14" rx="4" ry="7" fill="#5e9070" opacity="0.40" transform="rotate(240 26 26)"/>
            <ellipse cx="26" cy="14" rx="4" ry="7" fill="#5e9070" opacity="0.45" transform="rotate(300 26 26)"/>
          </svg>
        </div>
        <h1 className="role-brand-name">MeaningBloom</h1>
        <p className="role-tagline"><BT k="roleTagline" lang={lang} /></p>
      </div>

      {/* Language picker */}
      <div className="lang-section">
        <p className="lang-section-title">{t('chooseLanguage', lang)}</p>
        <div className="lang-grid">
          {LANGUAGES.map(l => (
            <button
              key={l.id}
              className={`lang-btn ${pendingLang === l.id ? 'lang-btn--on' : ''}`}
              onClick={() => { setPendingLang(l.id); setError(false) }}
            >
              <span className="lang-native">{l.native}</span>
              <span className="lang-label">{l.label}</span>
            </button>
          ))}
        </div>
        {error && <p className="lang-error">⚠ {T[lang]?.selectLangFirst || T.en.selectLangFirst}</p>}
        <p className="lang-note">{t('langNote', lang)}</p>
      </div>

      {/* Connection visual */}
      <div className="connect-flow">
        <div className="connect-node connect-node--customer">
          <span className="connect-icon">◉</span>
          <span className="connect-label"><BT k="connectVisitor" lang={lang} /></span>
        </div>
        <div className="connect-line">
          <span className="connect-dot" />
          <span className="connect-dot" />
          <span className="connect-dot" />
        </div>
        <div className="connect-node connect-node--staff">
          <span className="connect-icon">◉</span>
          <span className="connect-label"><BT k="connectStaff" lang={lang} /></span>
        </div>
      </div>

      {/* Role question */}
      <div className="role-question">
        <p className="role-q-en">{t('chooseView', lang)}</p>
      </div>

      {/* Role cards */}
      <div className="role-cards">
        <div className="role-card role-card--customer">
          <div className="role-card-art">
            <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
              <circle cx="28" cy="20" r="10" stroke="#c8a428" strokeWidth="1.5" fill="rgba(200,164,40,0.08)"/>
              <path d="M10 46 Q28 34 46 46" stroke="#c8a428" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
            </svg>
          </div>
          <h2 className="role-card-title">{T.en.customerTitle}</h2>
          {lang !== 'en' && lang !== 'other' && T[lang]?.customerTitle && (
            <p className="role-card-zh">{T[lang].customerTitle}</p>
          )}
          <button className="btn-role btn-role--customer" onClick={() => handleEnter('customer')}>
            {t('enterCustomer', lang)}
          </button>
        </div>

        <div className="role-card role-card--staff">
          <div className="role-card-art">
            <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
              <circle cx="20" cy="28" r="9" stroke="#5e9070" strokeWidth="1.5" fill="rgba(94,144,112,0.08)"/>
              <circle cx="36" cy="28" r="9" stroke="#5e9070" strokeWidth="1.5" fill="rgba(94,144,112,0.08)"/>
              <ellipse cx="28" cy="28" rx="4" ry="7" fill="rgba(94,144,112,0.18)"/>
            </svg>
          </div>
          <h2 className="role-card-title">{T.en.staffTitle}</h2>
          {lang !== 'en' && lang !== 'other' && T[lang]?.staffTitle && (
            <p className="role-card-zh">{T[lang].staffTitle}</p>
          )}
          <button className="btn-role btn-role--staff" onClick={() => handleEnter('staff')}>
            {t('enterStaff', lang)}
          </button>
        </div>
      </div>

      <p className="role-note">{t('appPhrase', lang)}</p>
    </div>
  )
}

/* ─────────────────────────────────────────────
   Top Navigation Bar — frosted glass style
───────────────────────────────────────────── */
function TopNav({ role, lang, liveInterp, onToggleLiveInterp, onSwitch, onReset, onChangeLang, showLangPanel }) {
  const langObj = LANGUAGES.find(l => l.id === lang) || LANGUAGES[0]
  return (
    <div className={`top-nav top-nav--${role}`}>
      <div className="brand">
        <span className="brand-bloom" aria-hidden="true">❋</span>
        <span className="brand-name">MeaningBloom</span>
      </div>

      <div className="nav-center">
        <span className={`view-badge view-badge--${role}`}>
          {role === 'customer' ? t('connectVisitor', lang) : t('connectStaff', lang)}
        </span>
        {role === 'customer' && (
          <button
            className={`btn-live-interp ${liveInterp ? 'btn-live-interp--on' : ''}`}
            onClick={onToggleLiveInterp}
          >
            {liveInterp ? t('liveInterpActive', lang) : t('liveInterpToggle', lang)}
          </button>
        )}
        <button className={`lang-indicator ${showLangPanel ? 'lang-indicator--active' : ''}`} onClick={onChangeLang}>
          <span className="lang-indicator-native">{langObj.native}</span>
          <span className="lang-indicator-caret">{showLangPanel ? '▲' : '▼'}</span>
        </button>
      </div>

      <div className="top-nav-actions">
        <button className="btn-switch" onClick={onSwitch}>
          ⇄ {role === 'customer' ? t('connectStaff', lang) : t('connectVisitor', lang)}
        </button>
        <button className="btn-back-role" onClick={onReset}>← {t('startLbl', lang)}</button>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   PanelNav — per-panel header in table mode
───────────────────────────────────────────── */
function PanelNav({ role, lang, extLang, liveInterp, onToggleLiveInterp, showLangPanel, onChangeLang }) {
  const langObj    = LANGUAGES.find(l => l.id === lang) || LANGUAGES[0]
  const displayNative = extLang?.native || langObj.native
  return (
    <div className={`panel-nav panel-nav--${role}`}>
      <div className="panel-nav-brand">
        <span className="panel-bloom-mark" aria-hidden="true">❋</span>
        <span className="panel-role-lbl">
          {role === 'customer' ? t('connectVisitor', lang) : t('connectStaff', lang)}
        </span>
      </div>
      <div className="panel-nav-actions">
        {role === 'customer' && onToggleLiveInterp && (
          <button
            className={`btn-live-interp ${liveInterp ? 'btn-live-interp--on' : ''}`}
            onClick={onToggleLiveInterp}
          >
            {liveInterp ? t('liveInterpActive', lang) : t('liveInterpToggle', lang)}
          </button>
        )}
        <button
          className={`lang-indicator ${showLangPanel ? 'lang-indicator--active' : ''}`}
          onClick={onChangeLang}
        >
          <span className="lang-indicator-native">{displayNative}</span>
          <span className="lang-indicator-caret">{showLangPanel ? '▲' : '▼'}</span>
        </button>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   Language Panel
───────────────────────────────────────────── */
function LangPanel({ currentLang, extLang, onSelect, onClose }) {
  const [showWorld, setShowWorld] = useState(false)
  const [query, setQuery]         = useState('')
  const searchRef = useRef(null)

  useEffect(() => {
    if (showWorld) setTimeout(() => searchRef.current?.focus(), 80)
  }, [showWorld])

  const filtered = query.trim()
    ? WORLD_LANGUAGES.filter(l =>
        l.native.toLowerCase().includes(query.toLowerCase()) ||
        l.en.toLowerCase().includes(query.toLowerCase())
      )
    : WORLD_LANGUAGES

  if (showWorld) {
    return (
      <div className="lang-panel lang-panel--world">
        <div className="lang-panel-world-header">
          <button className="lp-back-btn" onClick={() => { setShowWorld(false); setQuery('') }}>← Back</button>
          <span className="lp-world-title">All languages</span>
          <button className="lang-panel-close" onClick={onClose}>✕</button>
        </div>
        <div className="cs0-search-row" style={{ maxWidth: '100%', margin: '8px 0' }}>
          <input
            ref={searchRef}
            className="cs0-search"
            type="text"
            placeholder="Search language…"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          {query && (
            <button className="cs0-search-clear" onClick={() => setQuery('')}>✕</button>
          )}
        </div>
        <div className="lp-world-grid">
          {filtered.length === 0 && (
            <p className="cs0-no-results">No match.</p>
          )}
          {filtered.map(l => {
            const isOn = extLang?.myMemory === l.myMemory
            return (
              <button
                key={l.id}
                className={`lp-world-btn ${isOn ? 'lp-world-btn--on' : ''}`}
                onClick={() => onSelect('other', { myMemory: l.myMemory, speech: l.speech, native: l.native, en: l.en })}
              >
                <span className="cs0-world-native">{l.native}</span>
                <span className="cs0-world-en">{l.en}</span>
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="lang-panel">
      <div className="lang-panel-grid">
        {LANGUAGES.filter(l => l.id !== 'other').map(l => (
          <button
            key={l.id}
            className={`lang-btn lang-btn--panel ${currentLang === l.id && !extLang ? 'lang-btn--on' : ''}`}
            onClick={() => onSelect(l.id)}
          >
            <span className="lang-native">{l.native}</span>
            <span className="lang-label">{l.label}</span>
          </button>
        ))}
        <button
          className={`lang-btn lang-btn--panel lang-btn--more ${extLang ? 'lang-btn--on' : ''}`}
          onClick={() => setShowWorld(true)}
        >
          <span className="lang-native">{extLang ? extLang.native : '🌍'}</span>
          <span className="lang-label">{extLang ? extLang.en : 'More…'}</span>
        </button>
      </div>
      <button className="lang-panel-close" onClick={onClose}>✕ {t('closePanel', currentLang)}</button>
    </div>
  )
}

/* ─────────────────────────────────────────────
   Live Interpretation Panel
───────────────────────────────────────────── */
function LiveInterpPanel({ lang, speechLang, nativeLangLabel, text, setText, translatedText, translating, onClose }) {
  const [listening, setListening]   = useState(false)
  const [supported, setSupported]   = useState(true)
  const [interimText, setInterimText] = useState('')
  const recogRef  = useRef(null)
  const baseRef   = useRef('')   // text value when recognition started
  const langCode  = speechLang || SPEECH_LANG_CODES[lang] || 'en-US'

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) setSupported(false)
  }, [])

  /* stop recognition when component unmounts or lang changes */
  useEffect(() => {
    return () => { recogRef.current?.stop(); recogRef.current = null }
  }, [])

  const startListening = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) return
    const rec = new SR()
    recogRef.current = rec
    rec.lang        = langCode
    rec.continuous  = true
    rec.interimResults = true
    baseRef.current = text   // preserve anything already typed

    rec.onresult = (e) => {
      let finals = ''
      let interim = ''
      for (let i = 0; i < e.results.length; i++) {
        if (e.results[i].isFinal) finals += e.results[i][0].transcript + ' '
        else interim += e.results[i][0].transcript
      }
      setInterimText(interim)
      setText((baseRef.current + ' ' + finals).trim())
    }
    rec.onerror = () => { setListening(false); setInterimText('') }
    rec.onend   = () => { setListening(false); setInterimText('') }
    rec.start()
    setListening(true)
  }

  const stopListening = () => {
    recogRef.current?.stop()
    recogRef.current = null
    setListening(false)
    setInterimText('')
  }

  const langLabel = nativeLangLabel || LANGUAGES.find(l => l.id === lang)?.native || ''

  return (
    <div className="live-interp-panel">
      <div className="lip-header">
        <span className="lip-dot" aria-hidden="true">●</span>
        <span className="lip-title">
          {T.en.liveInterpTitle}
          {lang !== 'en' && lang !== 'other' && T[lang]?.liveInterpTitle && (
            <span className="lip-title-tr"> / {T[lang].liveInterpTitle}</span>
          )}
        </span>
        <button className="lip-close" onClick={() => { stopListening(); onClose() }} aria-label="close">
          ✕ {t('liveInterpOff', lang)}
        </button>
      </div>

      {/* Language indicator */}
      <div className="lip-lang-row">
        <span className="lip-lang-badge">
          🌐 {langLabel || 'English'}
          {lang !== 'en' && lang !== 'other' && <span className="lip-lang-arrow"> → English</span>}
        </span>
        {!supported && (
          <span className="lip-unsupported">{t('micUnsupported', lang)}</span>
        )}
      </div>

      {/* Mic button */}
      {supported && (
        <button
          className={`lip-mic-btn ${listening ? 'lip-mic-btn--on' : ''}`}
          onClick={listening ? stopListening : startListening}
        >
          {listening
            ? <><span className="lip-mic-wave"/>{t('micStop', lang)}</>
            : <>{t('micStart', lang)}</>
          }
        </button>
      )}

      {/* Live interim display */}
      {listening && interimText && (
        <div className="lip-interim">{interimText}</div>
      )}

      {/* Typed / final text */}
      <textarea
        className="lip-input"
        placeholder={t('liveInterpInput', lang)}
        value={text}
        onChange={e => { baseRef.current = e.target.value; setText(e.target.value) }}
        rows={2}
      />
      {text.trim() && (
        <button className="lip-clear-btn" onClick={() => { setText(''); baseRef.current = '' }}>
          {t('lipClearBtn', lang)}
        </button>
      )}

      {/* Translated output shown to staff */}
      {(text.trim() || translating) && (
        <div className={`lip-output ${translating ? 'lip-output--translating' : ''}`}>
          <p className="lip-output-label">{t('liveInterpOutputLabel', lang)}</p>
          {translating
            ? <span className="t-ic-dots"><span/><span/><span/></span>
            : <p className="lip-output-text">{translatedText || text}</p>
          }
        </div>
      )}
    </div>
  )
}

/* ─────────────────────────────────────────────
   CS1 — What brings you here today?
───────────────────────────────────────────── */
/* ─────────────────────────────────────────────
   CS0 — Language Selection (first screen)
───────────────────────────────────────────── */
function CS0({ onSelectLang, onStart, currentLang, customerExtLang }) {
  const [showWorld, setShowWorld] = useState(false)
  const [query, setQuery]         = useState('')
  const [interpOn, setInterpOn]   = useState(false)
  const searchRef = useRef(null)

  const needsInterp = currentLang !== 'en' && currentLang !== 'other'
  const nativeName  = customerExtLang?.native || LANGUAGES.find(l => l.id === currentLang)?.native || ''

  useEffect(() => {
    if (showWorld) setTimeout(() => searchRef.current?.focus(), 80)
  }, [showWorld])

  /* Auto-disable interp if user switches to English */
  useEffect(() => {
    if (!needsInterp) setInterpOn(false)
  }, [needsInterp])

  const filtered = query.trim()
    ? WORLD_LANGUAGES.filter(l =>
        l.native.toLowerCase().includes(query.toLowerCase()) ||
        l.en.toLowerCase().includes(query.toLowerCase())
      )
    : WORLD_LANGUAGES

  /* ── World language list ── */
  if (showWorld) {
    return (
      <div className="cs0-wrap screen-enter">
        <button className="cs0-back-btn" onClick={() => { setShowWorld(false); setQuery('') }}>
          ← Back
        </button>
        <h2 className="cs0-title" style={{ marginBottom: 14 }}>
          All languages
          <span className="cs0-title-sub">所有语言 · Todos los idiomas · Toutes les langues</span>
        </h2>
        <div className="cs0-search-row">
          <input ref={searchRef} className="cs0-search" type="text"
            placeholder="Search language…" value={query}
            onChange={e => setQuery(e.target.value)} />
          {query && <button className="cs0-search-clear" onClick={() => setQuery('')}>✕</button>}
        </div>
        <div className="cs0-world-grid">
          {filtered.length === 0 && <p className="cs0-no-results">No match — try another spelling.</p>}
          {filtered.map(l => {
            const isOn = customerExtLang?.myMemory === l.myMemory
            return (
              <button key={l.id}
                className={`cs0-world-btn ${isOn ? 'cs0-world-btn--on' : ''}`}
                onClick={() => {
                  onSelectLang('other', { myMemory: l.myMemory, speech: l.speech, native: l.native, en: l.en })
                  setShowWorld(false); setQuery('')
                }}>
                <span className="cs0-world-native">{l.native}</span>
                <span className="cs0-world-en">{l.en}</span>
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  /* ── Main language selection + interp toggle ── */
  return (
    <div className="cs0-wrap screen-enter">
      <h2 className="cs0-title">
        Choose your language
        <span className="cs0-title-sub">选择语言 · Chọn ngôn ngữ · Piliin ang wika</span>
      </h2>

      <div className="cs0-lang-grid">
        {LANGUAGES.filter(l => l.id !== 'other').map(l => (
          <button key={l.id}
            className={`cs0-lang-btn ${currentLang === l.id && !customerExtLang ? 'cs0-lang-btn--on' : ''}`}
            onClick={() => onSelectLang(l.id)}>
            <span className="cs0-lang-native">{l.native}</span>
            <span className="cs0-lang-en">{l.en}</span>
          </button>
        ))}
        <button
          className={`cs0-lang-btn cs0-lang-btn--other ${customerExtLang ? 'cs0-lang-btn--on' : ''}`}
          onClick={() => setShowWorld(true)}>
          <span className="cs0-lang-native">{customerExtLang ? customerExtLang.native : '🌍'}</span>
          <span className="cs0-lang-en">{customerExtLang ? customerExtLang.en : 'More languages…'}</span>
        </button>
      </div>

      {/* ── Live interpretation card ── */}
      <div className={`cs0-interp-card ${interpOn ? 'cs0-interp-card--on' : ''} ${!needsInterp ? 'cs0-interp-card--disabled' : ''}`}>
        <div className="cs0-interp-info">
          <span className="cs0-interp-icon">{interpOn ? '🎤' : '🎙️'}</span>
          <div>
            <p className="cs0-interp-title">Live Interpretation · 同声传译</p>
            <p className="cs0-interp-sub">
              {needsInterp
                ? (interpOn
                    ? `Speak in ${nativeName} — staff sees English instantly`
                    : 'Speak in your language, staff hears English')
                : 'Select a non-English language to enable'}
            </p>
          </div>
        </div>
        <button
          className={`cs0-interp-toggle ${interpOn ? 'cs0-interp-toggle--on' : ''}`}
          onClick={() => needsInterp && setInterpOn(p => !p)}
          disabled={!needsInterp}
          aria-label="Toggle live interpretation"
        >
          <span className="cs0-toggle-knob" />
        </button>
      </div>

      {/* ── Start button ── */}
      <button
        className={`cs0-start-btn ${interpOn ? 'cs0-start-btn--interp' : ''}`}
        onClick={() => onStart(interpOn)}
      >
        {interpOn ? '🎤 Start with Live Interpretation' : 'Start →'}
      </button>
    </div>
  )
}

/* ─────────────────────────────────────────────
   CSInterp — Live Interpretation Primary Screen
───────────────────────────────────────────── */
function CSInterp({ lang, speechLang, nativeLangLabel, text, setText, translatedText, translating, onGoToHelp, staffReply, staffReplyTranslated, staffReplying }) {
  const [listening, setListening]     = useState(false)
  const [supported, setSupported]     = useState(true)
  const [interimText, setInterimText] = useState('')
  const recogRef = useRef(null)
  const baseRef  = useRef('')
  const langCode = speechLang || 'en-US'

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) setSupported(false)
  }, [])

  useEffect(() => () => { recogRef.current?.stop() }, [])

  const startListening = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) return
    const rec = new SR()
    recogRef.current = rec
    rec.lang = langCode; rec.continuous = true; rec.interimResults = true
    baseRef.current = text
    rec.onresult = (e) => {
      let finals = '', interim = ''
      for (let i = 0; i < e.results.length; i++) {
        if (e.results[i].isFinal) finals += e.results[i][0].transcript + ' '
        else interim += e.results[i][0].transcript
      }
      setInterimText(interim)
      setText((baseRef.current + ' ' + finals).trim())
    }
    rec.onerror = () => { setListening(false); setInterimText('') }
    rec.onend   = () => { setListening(false); setInterimText('') }
    rec.start(); setListening(true)
  }

  const stopListening = () => {
    recogRef.current?.stop(); recogRef.current = null
    setListening(false); setInterimText('')
  }

  return (
    <div className="csi-root screen-enter">

      {/* Header */}
      <div className="csi-header">
        <span className="csi-lang-pill">🌐 {nativeLangLabel || 'Your language'}</span>
        <span className={`csi-status-dot ${listening ? 'csi-status-dot--on' : ''}`} />
        <span className="csi-status-text">{listening ? 'Listening…' : 'Ready'}</span>
      </div>

      {/* Mic button — the hero element */}
      <div className="csi-mic-area">
        {supported ? (
          <button
            className={`csi-mic-btn ${listening ? 'csi-mic-btn--on' : ''}`}
            onClick={listening ? stopListening : startListening}
          >
            <span className="csi-mic-icon">{listening ? '⏹' : '🎤'}</span>
            <span className="csi-mic-label">
              {listening ? 'Tap to stop' : 'Tap to speak'}
            </span>
          </button>
        ) : (
          <p className="csi-no-mic">Voice not supported — type below</p>
        )}
        {listening && interimText && (
          <p className="csi-interim">{interimText}</p>
        )}
      </div>

      {/* Your message */}
      <div className="csi-section csi-section--you">
        <span className="csi-section-label">
          {nativeLangLabel ? `You (${nativeLangLabel}):` : 'Your message:'}
        </span>
        <textarea
          className="csi-textarea"
          value={text}
          onChange={e => { baseRef.current = e.target.value; setText(e.target.value) }}
          placeholder="Or type here…"
          rows={3}
        />
        {text && (
          <button className="lip-clear-btn" onClick={() => { setText(''); baseRef.current = '' }}>
            Clear
          </button>
        )}
      </div>

      {/* Staff sees */}
      <div className={`csi-section csi-section--staff ${(text || translating) ? 'csi-section--active' : ''}`}>
        <span className="csi-section-label">Staff sees (English):</span>
        {translating
          ? <span className="t-ic-dots"><span/><span/><span/></span>
          : <p className="csi-translation">{translatedText || (text ? text : '—')}</p>
        }
      </div>

      {/* Staff reply — translated back to customer language */}
      {(staffReply || staffReplying) && (
        <div className={`csi-section csi-section--staff-reply ${staffReplyTranslated ? 'csi-section--active' : ''}`}>
          <span className="csi-section-label">
            Staff says{nativeLangLabel ? ` (${nativeLangLabel})` : ''}:
          </span>
          {staffReplying
            ? <span className="t-ic-dots"><span/><span/><span/></span>
            : <p className="csi-translation csi-staff-reply-text">{staffReplyTranslated || staffReply}</p>
          }
        </div>
      )}

      {/* Help screens link */}
      <button className="csi-help-link" onClick={onGoToHelp}>
        Also browse help options →
      </button>
    </div>
  )
}

/* ─────────────────────────────────────────────
   CS1 — What brings you here today?
───────────────────────────────────────────── */
function CS1({ goTo, selectedNeeds, toggleNeed, lang }) {
  return (
    <div className="card screen-enter">
      <div className="card-eyebrow">Step 1 of 3</div>
      <h2 className="title-lg">
        {T.en.cs1Title}
        {lang !== 'en' && lang !== 'other' && T[lang]?.cs1Title && (
          <span className="bi-sec">{T[lang].cs1Title}</span>
        )}
      </h2>
      <p className="instruction">{t('cs1Inst', lang)}</p>

      <div className="option-grid">
        {NEEDS_OPTIONS.map(opt => {
          const sec = getSecondary(opt.id, lang)
          const on = selectedNeeds.includes(opt.id)
          return (
            <button
              key={opt.id}
              className={`option-card ${on ? 'option-card--on' : ''}`}
              onClick={() => toggleNeed(opt.id)}
            >
              {on && <span className="chk-badge">✓</span>}
              <span className="opt-emoji" aria-hidden="true">{opt.emoji}</span>
              <span className="opt-en">{opt.en}</span>
              {(sec || opt.zh) && <span className="opt-zh">{sec || opt.zh}</span>}
            </button>
          )
        })}
      </div>

      <button className="btn-primary" onClick={() => goTo(2)} disabled={selectedNeeds.length === 0}>
        {t('next', lang)}
      </button>
    </div>
  )
}

/* ─────────────────────────────────────────────
   CS2 — Conversation Preference
───────────────────────────────────────────── */
function CS2({ goTo, selectedPrefs, togglePref, lang }) {
  return (
    <div className="card screen-enter">
      <div className="card-eyebrow">Step 2 of 3</div>
      <h2 className="title-lg">
        {T.en.cs2Title}
        {lang !== 'en' && lang !== 'other' && T[lang]?.cs2Title && (
          <span className="bi-sec">{T[lang].cs2Title}</span>
        )}
      </h2>
      <p className="instruction">{t('cs2Inst', lang)}</p>

      <div className="option-list">
        {PREF_OPTIONS.map(opt => {
          const sec = getSecondary(opt.id, lang)
          const on = selectedPrefs.includes(opt.id)
          return (
            <button
              key={opt.id}
              className={`option-row ${on ? 'option-row--on' : ''}`}
              onClick={() => togglePref(opt.id)}
            >
              <span className="opt-emoji pref-emoji" aria-hidden="true">{opt.emoji}</span>
              <span className="opt-text-block">
                <span className="opt-en">{opt.en}</span>
                {(sec || opt.zh) && <span className="opt-zh">{sec || opt.zh}</span>}
              </span>
              <span className={`chk-circle ${on ? 'chk-circle--on' : ''}`}>
                {on ? '✓' : ''}
              </span>
            </button>
          )
        })}
      </div>

      <div className="btn-group">
        <button className="btn-primary" onClick={() => goTo(3)}>{t('next', lang)}</button>
        <button className="btn-ghost" onClick={() => goTo(1)}>{t('back', lang)}</button>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   CS3 — Review My Request
───────────────────────────────────────────── */
function CS3({ goTo, selectedNeeds, selectedPrefs, requestShared, onShare, onGoStaff, lang }) {
  const needLabels = NEEDS_OPTIONS.filter(o => selectedNeeds.includes(o.id))
  const prefLabels = PREF_OPTIONS.filter(o => selectedPrefs.includes(o.id))

  if (requestShared) {
    return (
      <div className="card card--center screen-enter">
        <div className="success-bloom" aria-hidden="true">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
            <circle cx="32" cy="32" r="6" fill="#5e9070" opacity="0.9"/>
            <ellipse cx="32" cy="17" rx="5" ry="9" fill="#5e9070" opacity="0.4" transform="rotate(0 32 32)"/>
            <ellipse cx="32" cy="17" rx="5" ry="9" fill="#5e9070" opacity="0.38" transform="rotate(60 32 32)"/>
            <ellipse cx="32" cy="17" rx="5" ry="9" fill="#5e9070" opacity="0.38" transform="rotate(120 32 32)"/>
            <ellipse cx="32" cy="17" rx="5" ry="9" fill="#5e9070" opacity="0.35" transform="rotate(180 32 32)"/>
            <ellipse cx="32" cy="17" rx="5" ry="9" fill="#5e9070" opacity="0.35" transform="rotate(240 32 32)"/>
            <ellipse cx="32" cy="17" rx="5" ry="9" fill="#5e9070" opacity="0.38" transform="rotate(300 32 32)"/>
          </svg>
        </div>
        <h2 className="title-lg">
          {T.en.sharedSuccess}
          {lang !== 'en' && lang !== 'other' && T[lang]?.sharedSuccess && (
            <span className="bi-sec">{T[lang].sharedSuccess}</span>
          )}
        </h2>
        <span className="badge badge--shared"><BT k="sharedWithStaff" lang={lang} /></span>
        <p className="small-note" style={{ marginTop: 16, maxWidth: 320, textAlign: 'center' }}>
          <BT k="switchToStaffNote" lang={lang} />
        </p>
        <div className="btn-group" style={{ width: '100%', maxWidth: 340 }}>
          <button className="btn-primary" onClick={onGoStaff}>{t('goStaffView', lang)}</button>
          <button className="btn-ghost" onClick={() => goTo(4)}>{t('continueCustomer', lang)}</button>
        </div>
      </div>
    )
  }

  return (
    <div className="card screen-enter">
      <div className="card-eyebrow">Step 3 of 3 — Review</div>
      <h2 className="title-lg">
        {T.en.cs3Title}
        {lang !== 'en' && lang !== 'other' && T[lang]?.cs3Title && (
          <span className="bi-sec">{T[lang].cs3Title}</span>
        )}
      </h2>

      <div className="review-block">
        <p className="review-label">{t('lookingFor', lang)}</p>
        <div className="chip-row">
          {needLabels.map(n => {
            const sec = getSecondary(n.id, lang)
            return (
              <span key={n.id} className="chip chip--warm">
                {n.emoji} {n.en}{sec ? ` / ${sec}` : ''}
              </span>
            )
          })}
        </div>
      </div>

      <div className="review-block">
        <p className="review-label">{t('convPrefs', lang)}</p>
        {prefLabels.length > 0 ? (
          <div className="pref-list">
            {prefLabels.map(p => {
              const sec = getSecondary(p.id, lang)
              return (
                <div key={p.id} className="pref-item">
                  {p.emoji} {p.en}{sec ? ` / ${sec}` : ''}
                </div>
              )
            })}
          </div>
        ) : (
          <p className="pref-item" style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
            {t('noPrefSelected', lang)}
          </p>
        )}
      </div>

      <div className="btn-group">
        <button className="btn-primary" onClick={onShare}>{t('shareWithStaff', lang)}</button>
        <button className="btn-ghost" onClick={() => goTo(1)}>{t('edit', lang)}</button>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   CS4 — Customer Conversation Support
───────────────────────────────────────────── */
function CS4({
  goTo, requestShared,
  customerBreakdown, setCustomerBreakdown,
  selectedRecovery, setSelectedRecovery,
  recoverySignalSent, setRecoverySignalSent,
  recoveryOpt, currentPhrase,
  editingPhrase, setEditingPhrase,
  customPhrase, setCustomPhrase,
  onViewStaff, lang,
  staffAcknowledged,
  visitorWord, setVisitorWord,
  staffWord,
  breathingActive, setBreathingActive,
}) {
  const recoveryOptions =
    customerBreakdown === 'misunderstood' ? RECOVERY_MISUNDERSTOOD : RECOVERY_STUCK

  return (
    <div className="card screen-enter">
      <h2 className="title-lg">
        {T.en.cs4Title}
        {lang !== 'en' && lang !== 'other' && T[lang]?.cs4Title && (
          <span className="bi-sec">{T[lang].cs4Title}</span>
        )}
      </h2>
      {requestShared && (
        <div className="badge-row">
          <span className="badge badge--shared"><BT k="sharedWithStaff" lang={lang} /></span>
          {staffAcknowledged && (
            <span className="badge badge--ack screen-enter"><BT k="staffAckedBadge" lang={lang} /></span>
          )}
        </div>
      )}

      {/* ── Breathing Together ── */}
      {requestShared && (
        <div className="cs4-interactive-row">
          <button
            className={`btn-breathe ${breathingActive ? 'btn-breathe--on' : ''}`}
            onClick={() => setBreathingActive(p => !p)}
          >
            {breathingActive ? '● ' : '○ '}
            <BT k="breatheTogether" lang={lang} />
          </button>
          {breathingActive && (
            <div className="breath-orb-customer" aria-label="Breathing exercise" />
          )}
        </div>
      )}

      {/* ── Word Bridge — visitor side ── */}
      {requestShared && (
        <div className="word-bridge-visitor">
          <p className="wb-label"><BT k="wordBridgeVisitorLabel" lang={lang} /></p>
          <div className="wb-input-row">
            <input
              className="wb-input"
              maxLength={24}
              placeholder={T.en.wordBridgePlaceholder}
              value={visitorWord}
              onChange={e => setVisitorWord(e.target.value)}
            />
            {staffWord && (
              <div className="wb-staff-echo">
                <span className="wb-echo-lbl"><BT k="wordBridgeStaffEcho" lang={lang} /></span>
                <span className="wb-echo-word">{staffWord}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {!customerBreakdown && (
        <div className="breakdown-buttons">
          <button
            className="breakdown-btn breakdown-btn--misunderstood"
            onClick={() => { setCustomerBreakdown('misunderstood'); setSelectedRecovery(null) }}
          >
            <span className="breakdown-icon">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="13" stroke="#b07050" strokeWidth="1.5" fill="rgba(176,112,80,0.08)"/>
                <path d="M10 20 Q16 14 22 20" stroke="#b07050" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                <circle cx="12" cy="13" r="1.5" fill="#b07050"/>
                <circle cx="20" cy="13" r="1.5" fill="#b07050"/>
              </svg>
            </span>
            <span className="breakdown-en">{T.en.feelMisunderstood}</span>
            {lang !== 'en' && lang !== 'other' && T[lang]?.feelMisunderstood && (
              <span className="breakdown-zh">{T[lang].feelMisunderstood}</span>
            )}
          </button>
          <button
            className="breakdown-btn breakdown-btn--stuck"
            onClick={() => { setCustomerBreakdown('stuck'); setSelectedRecovery(null) }}
          >
            <span className="breakdown-icon">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="13" stroke="#9a7a30" strokeWidth="1.5" fill="rgba(154,122,48,0.08)"/>
                <path d="M10 18 Q16 16 22 18" stroke="#9a7a30" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                <circle cx="12" cy="13" r="1.5" fill="#9a7a30"/>
                <circle cx="20" cy="13" r="1.5" fill="#9a7a30"/>
                <path d="M14 8 Q16 5 18 8" stroke="#9a7a30" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
              </svg>
            </span>
            <span className="breakdown-en">{T.en.feelStuck}</span>
            {lang !== 'en' && lang !== 'other' && T[lang]?.feelStuck && (
              <span className="breakdown-zh">{T[lang].feelStuck}</span>
            )}
          </button>
        </div>
      )}

      {customerBreakdown && (
        <>
          <div className="breakdown-context-tag">
            <span>
              {customerBreakdown === 'misunderstood'
                ? `${t('feelMisunderstood', lang)}`
                : `${t('feelStuck', lang)}`}
            </span>
            <button className="clear-breakdown"
              onClick={() => { setCustomerBreakdown(null); setSelectedRecovery(null) }}>
              {t('change', lang)}
            </button>
          </div>

          <div className="option-list">
            {recoveryOptions.map(opt => {
              const sec = getSecondary(opt.id, lang)
              return (
                <button
                  key={opt.id}
                  className={`option-row option-row--recovery ${selectedRecovery === opt.id ? 'option-row--recovery-on' : ''}`}
                  onClick={() => { setSelectedRecovery(opt.id); setEditingPhrase(false) }}
                >
                  <span className="opt-text-block">
                    <span className="opt-en">{opt.en}</span>
                    {(sec || opt.zh) && <span className="opt-zh">{sec || opt.zh}</span>}
                  </span>
                  {selectedRecovery === opt.id && <span className="selected-dot">●</span>}
                </button>
              )
            })}
          </div>

          {recoveryOpt && (
            <div className="recovery-phrase-box">
              <p className="recovery-phrase-label"><BT k="suggestedSentence" lang={lang} /></p>
              {!editingPhrase ? (
                <>
                  <p className="recovery-phrase">"{currentPhrase}"</p>
                  <p className="small-note">{t('canSayThis', lang)}</p>
                  <div className="btn-group">
                    {!recoverySignalSent ? (
                      <button className="btn-primary" onClick={() => setRecoverySignalSent(true)}>
                        {t('sendSignal', lang)}
                      </button>
                    ) : (
                      <div className="signal-confirmation">
                        <span className="badge badge--signal">{t('signalSent', lang)}</span>
                        <button className="btn-ghost" style={{ marginTop: 10 }} onClick={onViewStaff}>
                          {t('viewStaffResp', lang)}
                        </button>
                      </div>
                    )}
                    <button className="btn-ghost"
                      onClick={() => { setCustomPhrase(recoveryOpt.phrase); setEditingPhrase(true) }}>
                      {t('editSentence', lang)}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <textarea className="phrase-editor" value={customPhrase}
                    onChange={e => setCustomPhrase(e.target.value)} rows={3} />
                  <div className="btn-group">
                    <button className="btn-primary"
                      onClick={() => { setRecoverySignalSent(true); setEditingPhrase(false) }}>
                      {t('sendSignal', lang)}
                    </button>
                    <button className="btn-ghost" onClick={() => setEditingPhrase(false)}>
                      {t('cancel', lang)}
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </>
      )}

      <div className="btn-group" style={{ marginTop: 20 }}>
        <button className="btn-ghost" onClick={() => goTo(5)}>{t('seeNextStep', lang)}</button>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   CS5 — Customer Next Step Summary
───────────────────────────────────────────── */
function CS5({ selectedNeeds, staffSummaryShared, resetAll, lang }) {
  const summaryParts = generateSummaryParts(selectedNeeds)
  return (
    <div className="card screen-enter">
      <h2 className="title-lg">
        {T.en.cs5Title}
        {lang !== 'en' && lang !== 'other' && T[lang]?.cs5Title && (
          <span className="bi-sec">{T[lang].cs5Title}</span>
        )}
      </h2>

      {staffSummaryShared && (
        <div className="badge-row">
          <span className="badge badge--staff-update"><BT k="updatedFromStaff" lang={lang} /></span>
        </div>
      )}

      <div className="understood-box">
        {summaryParts.map((p, i) => (
          <p key={i} className="understood-text"
            style={{ marginBottom: i < summaryParts.length - 1 ? 10 : 0 }}>
            {p}
          </p>
        ))}
      </div>

      <p className="section-label">{t('suggestedNextSteps', lang)}</p>
      <div className="steps-list">
        {NEXT_STEPS.map(s => {
          const sec = getSecondary(s.id, lang)
          return (
            <div key={s.n} className="step-item">
              <span className="step-num">{s.n}</span>
              <span className="step-text">
                <span className="step-en">{s.en}</span>
                {(sec || s.zh) && <span className="step-zh">{sec || s.zh}</span>}
              </span>
              <span className="step-emoji">{s.emoji}</span>
            </div>
          )
        })}
      </div>

      <div className="summary-btn-grid">
        <button className="btn-outline">💾 {t('saveLbl', lang)}</button>
        <button className="btn-outline">📱 {t('textMeLbl', lang)}</button>
        <button className="btn-outline">🖨️ {t('printLbl', lang)}</button>
        <button className="btn-primary" onClick={resetAll}>{t('done', lang)}</button>
      </div>

      <div className="closing-card">
        <div className="closing-bloom" aria-hidden="true">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="4" fill="#5e9070" opacity="0.6"/>
            <ellipse cx="20" cy="11" rx="3.5" ry="6" fill="#5e9070" opacity="0.28" transform="rotate(0 20 20)"/>
            <ellipse cx="20" cy="11" rx="3.5" ry="6" fill="#5e9070" opacity="0.25" transform="rotate(60 20 20)"/>
            <ellipse cx="20" cy="11" rx="3.5" ry="6" fill="#5e9070" opacity="0.25" transform="rotate(120 20 20)"/>
            <ellipse cx="20" cy="11" rx="3.5" ry="6" fill="#5e9070" opacity="0.22" transform="rotate(180 20 20)"/>
            <ellipse cx="20" cy="11" rx="3.5" ry="6" fill="#5e9070" opacity="0.22" transform="rotate(240 20 20)"/>
            <ellipse cx="20" cy="11" rx="3.5" ry="6" fill="#5e9070" opacity="0.25" transform="rotate(300 20 20)"/>
          </svg>
        </div>
        <p className="closing-title"><BT k="closingTitle" lang={lang} /></p>
        <div className="closing-affirmations">
          <span className="closing-affirm"><BT k="closingAffirm1" lang={lang} /></span>
          <span className="closing-affirm"><BT k="closingAffirm2" lang={lang} /></span>
          <span className="closing-affirm"><BT k="closingAffirm3" lang={lang} /></span>
        </div>
        <p className="closing-phrase"><BT k="appPhrase" lang={lang} /></p>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   SS1 — Staff View
───────────────────────────────────────────── */
function SS1({ goTo, selectedNeeds, selectedPrefs, requestShared, recoverySignalSent, onSwitchToCustomer, lang, customerLang, liveInterp, liveInterpText, onAcknowledge, staffWord, setStaffWord, visitorWord, breathingActive, setBreathingActive, staffReply, setStaffReply, staffReplyTranslated, staffReplying }) {
  const needLabels = NEEDS_OPTIONS.filter(o => selectedNeeds.includes(o.id))
  const prefLabels = PREF_OPTIONS.filter(o => selectedPrefs.includes(o.id))

  /* ── Staff reply speech recognition (English) ── */
  const [staffMicOn, setStaffMicOn]           = useState(false)
  const [staffMicInterim, setStaffMicInterim] = useState('')
  const [staffMicSupported, setStaffMicSupported] = useState(true)
  const staffRecRef = useRef(null)
  const staffReplyBase = useRef('')

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) setStaffMicSupported(false)
  }, [])
  useEffect(() => () => { staffRecRef.current?.stop() }, [])

  const startStaffMic = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) return
    const rec = new SR()
    staffRecRef.current = rec
    rec.lang = 'en-US'; rec.continuous = true; rec.interimResults = true
    staffReplyBase.current = staffReply || ''
    rec.onresult = (e) => {
      let finals = '', interim = ''
      for (let i = 0; i < e.results.length; i++) {
        if (e.results[i].isFinal) finals += e.results[i][0].transcript + ' '
        else interim += e.results[i][0].transcript
      }
      setStaffMicInterim(interim)
      if (setStaffReply) setStaffReply((staffReplyBase.current + ' ' + finals).trim())
    }
    rec.onerror = () => { setStaffMicOn(false); setStaffMicInterim('') }
    rec.onend   = () => { setStaffMicOn(false); setStaffMicInterim('') }
    rec.start(); setStaffMicOn(true)
  }

  const stopStaffMic = () => {
    staffRecRef.current?.stop(); staffRecRef.current = null
    setStaffMicOn(false); setStaffMicInterim('')
  }

  /* ── Waiting state ── */
  if (!requestShared) {
    /* When live interp is active, show the interp feed even before visitor shares */
    if (liveInterp) {
      return (
        <div className="ss1-root screen-enter">
          <div className={`ss1-interp-banner ${liveInterpText.trim() ? 'ss1-interp-banner--live' : ''}`}>
            <div className="ss1-ib-header">
              <span className={`ss1-ib-dot ${liveInterpText.trim() ? 'ss1-ib-dot--on' : ''}`}>●</span>
              <span className="ss1-ib-title">Live Interpretation</span>
              {liveInterpText.trim() && <span className="ss1-ib-tag">Incoming</span>}
            </div>
            <p className="ss1-ib-text">
              {liveInterpText.trim()
                ? liveInterpText
                : <em style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>{t('liveInterpTyping', lang)}</em>}
            </p>
            <div className="ss1-ib-reply">
              <div className="ss1-ib-reply-header">
                <span className="ss1-ib-reply-label">Your reply → customer's language:</span>
                {staffMicSupported && (
                  <button
                    className={`ss1-ib-mic-btn ${staffMicOn ? 'ss1-ib-mic-btn--on' : ''}`}
                    onClick={staffMicOn ? stopStaffMic : startStaffMic}
                    title={staffMicOn ? 'Stop speaking' : 'Speak your reply'}
                  >
                    {staffMicOn ? '⏹ Stop' : '🎤 Speak'}
                  </button>
                )}
              </div>
              {staffMicOn && staffMicInterim && (
                <p className="ss1-ib-mic-interim">{staffMicInterim}</p>
              )}
              <div className="ss1-ib-reply-row">
                <textarea
                  className="ss1-ib-reply-input"
                  rows={2}
                  placeholder={staffMicOn ? 'Listening…' : 'Type or speak your reply in English…'}
                  value={staffReply || ''}
                  onChange={e => { staffReplyBase.current = e.target.value; setStaffReply && setStaffReply(e.target.value) }}
                />
                {staffReply && (
                  <button className="ss1-ib-reply-clear" onClick={() => { setStaffReply && setStaffReply(''); staffReplyBase.current = '' }}>✕</button>
                )}
              </div>
              {staffReplying && (
                <span className="t-ic-dots" style={{ marginTop: 4 }}><span/><span/><span/></span>
              )}
              {staffReplyTranslated && !staffReplying && (
                <p className="ss1-ib-reply-translated">→ {staffReplyTranslated}</p>
              )}
            </div>
          </div>
          <div className="ss-wait" style={{ flex: 1 }}>
            <div className="ss-wait-pulse" aria-hidden="true" />
            <p className="ss-wait-title">{t('noRequestYet', lang)}</p>
            <p className="ss-wait-sub">{t('noRequestSub', lang)}</p>
          </div>
        </div>
      )
    }
    return (
      <div className="ss-wait screen-enter">
        <div className="ss-wait-pulse" aria-hidden="true" />
        <p className="ss-wait-title">{t('noRequestYet', lang)}</p>
        <p className="ss-wait-sub">{t('noRequestSub', lang)}</p>
      </div>
    )
  }

  const opening    = getSuggestedOpening(selectedNeeds)
  const langNative = LANGUAGES.find(l => l.id === customerLang)?.native

  return (
    <div className="ss1-root screen-enter">

      {/* ── 0. ClearLoop session context bar ── */}
      <div className="ss1-context-bar">
        <span className="ss1-ctx-dot" />
        <span className="ss1-ctx-title">{t('loopStatus', lang)}</span>
        <span className="ss1-ctx-spacer" />
        {langNative && customerLang !== 'en' && customerLang !== 'other' && (
          <span className="ss1-ctx-lang">🌐 {langNative}</span>
        )}
        {recoverySignalSent && (
          <span className="ss1-ctx-alert">↺ {t('recoveryAlert', lang)}</span>
        )}
      </div>

      {/* ── 1. What they shared ── */}
      <div className="ss1-snapshot">
        <span className="ss1-snap-heading">{t('visitorLookingFor', lang)}</span>

        <div className="ss1-needs-row">
          {needLabels.map(n => {
            const sec = getSecondary(n.id, customerLang)
            return (
              <div key={n.id} className="ss1-need-card">
                <span className="ss1-need-emoji">{n.emoji}</span>
                <span className="ss1-need-label">{n.en}{sec ? ` / ${sec}` : ''}</span>
              </div>
            )
          })}
        </div>

        {prefLabels.length > 0 && (
          <div className="ss1-prefs-strip">
            {prefLabels.map(p => (
              <span key={p.id} className="ss1-pref-pill">{p.emoji} {p.en}</span>
            ))}
          </div>
        )}

        <p className="ss1-principle">{t('clearloopPrinciple', lang)}</p>
      </div>

      {/* ── 2. Open the loop ── */}
      <div className="ss1-opener-card">
        <span className="ss1-opener-label">◎ {t('suggestedOpening', lang)}</span>
        <p className="ss1-opener-text">"{opening}"</p>
        <p className="ss1-opener-hint">{t('dontAssume', lang)}</p>
      </div>

      {/* ── 3. Live interp banner (prominent when active) ── */}
      {liveInterp && (
        <div className={`ss1-interp-banner ${liveInterpText.trim() ? 'ss1-interp-banner--live' : ''}`}>
          <div className="ss1-ib-header">
            <span className={`ss1-ib-dot ${liveInterpText.trim() ? 'ss1-ib-dot--on' : ''}`}>●</span>
            <span className="ss1-ib-title">Live Interpretation</span>
            {liveInterpText.trim() && <span className="ss1-ib-tag">Incoming</span>}
          </div>
          <p className="ss1-ib-text">
            {liveInterpText.trim()
              ? liveInterpText
              : <em style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>{t('liveInterpTyping', lang)}</em>}
          </p>

          {/* Staff reply input — sends translation back to customer */}
          <div className="ss1-ib-reply">
            <div className="ss1-ib-reply-header">
              <span className="ss1-ib-reply-label">Your reply → customer's language:</span>
              {staffMicSupported && (
                <button
                  className={`ss1-ib-mic-btn ${staffMicOn ? 'ss1-ib-mic-btn--on' : ''}`}
                  onClick={staffMicOn ? stopStaffMic : startStaffMic}
                  title={staffMicOn ? 'Stop speaking' : 'Speak your reply'}
                >
                  {staffMicOn ? '⏹ Stop' : '🎤 Speak'}
                </button>
              )}
            </div>
            {staffMicOn && staffMicInterim && (
              <p className="ss1-ib-mic-interim">{staffMicInterim}</p>
            )}
            <div className="ss1-ib-reply-row">
              <textarea
                className="ss1-ib-reply-input"
                rows={2}
                placeholder={staffMicOn ? 'Listening…' : 'Type or speak your reply in English…'}
                value={staffReply || ''}
                onChange={e => { staffReplyBase.current = e.target.value; setStaffReply && setStaffReply(e.target.value) }}
              />
              {staffReply && (
                <button className="ss1-ib-reply-clear" onClick={() => { setStaffReply && setStaffReply(''); staffReplyBase.current = '' }}>✕</button>
              )}
            </div>
            {staffReplying && (
              <span className="t-ic-dots" style={{ marginTop: 4 }}><span/><span/><span/></span>
            )}
            {staffReplyTranslated && !staffReplying && (
              <p className="ss1-ib-reply-translated">→ {staffReplyTranslated}</p>
            )}
          </div>
        </div>
      )}

      {/* ── 4. Word bridge + tools ── */}
      <div className="ss1-tools">
        <div className="ss1-wb-row">
          <input
            className="ss1-wb-input"
            maxLength={24}
            placeholder={T.en.wordBridgePlaceholder}
            value={staffWord}
            onChange={e => setStaffWord(e.target.value)}
          />
          {visitorWord && (
            <span className="ss1-wb-echo">
              "{visitorWord}"
            </span>
          )}
        </div>
        <div className="ss1-tool-btns">
          <button
            className={`ss1-tool-btn ${breathingActive ? 'ss1-tool-btn--on' : ''}`}
            onClick={() => setBreathingActive(p => !p)}
          >
            {breathingActive ? '● ' : '○ '}<BT k="breatheTogether" lang={lang} />
          </button>
          <button className="ss1-tool-btn ss1-tool-btn--ack" onClick={onAcknowledge}>
            ✓ <BT k="staffAckBtn" lang={lang} />
          </button>
        </div>
      </div>

      {/* ── 5. ClearLoop action tabs ── */}
      <div className="ss1-tabs">
        <button className="ss1-tab" onClick={() => goTo(2)}>
          <span className="ss1-tab-icon">◎</span>
          <div className="ss1-tab-body">
            <span className="ss1-tab-lbl"><BT k="checkMeaningNav" lang={lang} /></span>
            <span className="ss1-tab-sub">{t('tabSubCheck', lang)}</span>
          </div>
        </button>
        <button className={`ss1-tab ${recoverySignalSent ? 'ss1-tab--alert' : ''}`} onClick={() => goTo(3)}>
          <span className="ss1-tab-icon">↺{recoverySignalSent ? '●' : ''}</span>
          <div className="ss1-tab-body">
            <span className="ss1-tab-lbl"><BT k="recoverySupportNav" lang={lang} /></span>
            <span className="ss1-tab-sub">{recoverySignalSent ? t('tabSubRepairActive', lang) : t('tabSubRepairIdle', lang)}</span>
          </div>
        </button>
        <button className="ss1-tab ss1-tab--primary" onClick={() => goTo(4)}>
          <span className="ss1-tab-icon">∞</span>
          <div className="ss1-tab-body">
            <span className="ss1-tab-lbl"><BT k="createSummaryNav" lang={lang} /></span>
            <span className="ss1-tab-sub">{t('tabSubClose', lang)}</span>
          </div>
        </button>
      </div>

    </div>
  )
}

/* ─────────────────────────────────────────────
   CSMeaningCheck — Customer-side confirmation overlay
   Shown when staff sends a meaning check to the visitor
───────────────────────────────────────────── */
function CSMeaningCheck({ selectedNeeds, selectedMeanings, lang, onConfirm, onNotQuite }) {
  const meaningOptions = getMeaningOptions(selectedNeeds)
  const chosenItems = meaningOptions.filter(o => selectedMeanings.includes(o.id))

  return (
    <div className="csmcheck-overlay">
      <div className="csmcheck-card screen-enter">
        <div className="csmcheck-header">
          <span className="csmcheck-icon">◎</span>
          <span className="csmcheck-title">{t('staffCheckingMeaning', lang)}</span>
        </div>

        <p className="csmcheck-prompt">{t('staffVerifyPrompt', lang)}</p>

        {chosenItems.length > 0 ? (
          <div className="csmcheck-meanings">
            {chosenItems.map(item => {
              const localLabel = getSecondary(item.id, lang)
              return (
                <div key={item.id} className="csmcheck-meaning-item">
                  <span className="csmcheck-emoji">{item.emoji}</span>
                  <div className="csmcheck-labels">
                    <span className="csmcheck-en">{item.en}</span>
                    {localLabel && localLabel !== item.en && (
                      <span className="csmcheck-local">{localLabel}</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <p className="csmcheck-empty">◎</p>
        )}

        <div className="csmcheck-actions">
          <button className="csmcheck-yes" onClick={onConfirm}>
            ✓ {t('customerConfirmYes', lang)}
          </button>
          <button className="csmcheck-no" onClick={onNotQuite}>
            {t('customerConfirmNo', lang)}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   SS2 — Meaning Check Panel
───────────────────────────────────────────── */
function SS2({ goTo, selectedNeeds, selectedMeanings, toggleMeaning, meaningConfirmed, setMeaningConfirmed, onConfirm, customerMeaningConfirmed, showMeaningCheck, lang }) {
  const meaningOptions = getMeaningOptions(selectedNeeds)
  const chosenItems    = meaningOptions.filter(o => selectedMeanings.includes(o.id))
  const needCtx        = NEEDS_OPTIONS.filter(o => selectedNeeds.includes(o.id))

  const phraseItems = chosenItems.map(c => c.en.toLowerCase())
  const phraseList  =
    phraseItems.length === 0 ? '' :
    phraseItems.length === 1 ? phraseItems[0] :
    phraseItems.slice(0, -1).join(', ') + ', or ' + phraseItems.at(-1)

  /* Confirmed state */
  if (meaningConfirmed && chosenItems.length > 0) {
    return (
      <div className="ss2-root ss2-confirmed screen-enter">
        <div className="ss2-confirmed-icon">{customerMeaningConfirmed ? '✓' : '∞'}</div>
        <p className="ss2-confirmed-title">{t('meaningConfTitle', lang)}</p>
        <div className="ss2-confirmed-chips">
          {chosenItems.map(c => (
            <span key={c.id} className="ss2-chip ss2-chip--chosen">
              {c.emoji} {c.en}
            </span>
          ))}
        </div>
        <div className="ss2-confirmed-phrase">
          <span className="ss2-phrase-label">{t('staffPhrase', lang)}</span>
          <p className="ss2-phrase-text">
            "Just to make sure I understand — are you looking for {phraseList}?"
          </p>
        </div>

        {customerMeaningConfirmed ? (
          <div className="ss2-visitor-status ss2-visitor-status--confirmed screen-enter">
            <span className="ss2-vs-dot ss2-vs-dot--on" />
            {t('customerHasConfirmed', lang)}
          </div>
        ) : (
          <div className="ss2-visitor-status ss2-visitor-status--waiting">
            <span className="ss2-vs-dot" />
            {t('waitingConfirmation', lang)}
          </div>
        )}

        {customerMeaningConfirmed && (
          <p className="ss2-confirmed-note">{t('meaningVerifiedNote', lang)}</p>
        )}
        <button className="ss1-tab ss1-tab--primary" style={{ marginTop: 12 }} onClick={() => goTo(1)}>
          ← {t('backToDash', lang)}
        </button>
      </div>
    )
  }

  return (
    <div className="ss2-root screen-enter">
      {/* Context strip */}
      <div className="ss2-context">
        <span className="ss2-ctx-label">{t('visitorLookingFor', lang)}</span>
        {needCtx.map(n => (
          <span key={n.id} className="ss2-chip">{n.emoji} {n.en}</span>
        ))}
      </div>

      <p className="ss2-question">{t('ss2Title', lang)}</p>
      <p className="ss2-sub">{t('ss2Sub', lang)}</p>

      {/* Meaning cards */}
      <div className="ss2-grid">
        {meaningOptions.map(opt => {
          const on = selectedMeanings.includes(opt.id)
          return (
            <button
              key={opt.id}
              className={`ss2-card ${on ? 'ss2-card--on' : ''}`}
              onClick={() => toggleMeaning(opt.id)}
            >
              {on && <span className="ss2-check">✓</span>}
              <span className="ss2-card-emoji">{opt.emoji}</span>
              <span className="ss2-card-en">{opt.en}</span>
              {opt.zh && <span className="ss2-card-zh">{opt.zh}</span>}
            </button>
          )
        })}
      </div>

      {/* Live phrase preview */}
      <div className={`ss2-preview ${chosenItems.length > 0 ? 'ss2-preview--active' : ''}`}>
        <span className="ss2-preview-label">{t('staffPhrase', lang)}</span>
        <span className="ss2-preview-text">
          {chosenItems.length > 0
            ? `"Just to make sure I understand — are you looking for ${phraseList}?"`
            : <em style={{ color: 'var(--text-muted)' }}>{t('selectMeaningsHint', lang)}</em>}
        </span>
      </div>

      {/* Confirm */}
      <div className="ss2-footer">
        <button
          className="ss2-confirm-btn"
          disabled={selectedMeanings.length === 0}
          onClick={() => { setMeaningConfirmed(true); onConfirm?.() }}
        >
          ◎ {t('confirmMeaning', lang)}
          {selectedMeanings.length > 0 && (
            <span className="ss2-count"> ({selectedMeanings.length})</span>
          )}
        </button>
        <button className="ss2-back-btn" onClick={() => goTo(1)}>← {t('backToDash', lang)}</button>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   SS3 — Recovery Support Panel
───────────────────────────────────────────── */
function SS3({ goTo, recoverySignalSent, recoveryOpt, customerBreakdown, lang, customerLang }) {
  const staffResponse = recoveryOpt ? getStaffRecoveryResponse(recoveryOpt.id) : null
  const [usedTip, setUsedTip] = useState(null)

  const quickTips = [
    { id: 'time',    icon: '⏸', title: 'Give time', phrase: 'Take your time. There is no rush.' },
    { id: 'one',     icon: '❓', title: 'One question', phrase: 'Can you show me or point to what you need?' },
    { id: 'meaning', icon: '✓',  title: 'Check meaning', phrase: 'Do you mean… (repeat back what you heard)?' },
  ]

  return (
    <div className="ss3-root screen-enter">

      {recoverySignalSent && recoveryOpt ? (
        /* ── Signal received — show targeted repair ── */
        <>
          <div className="ss3-signal-header">
            <span className="ss3-signal-icon">↺</span>
            <div>
              <p className="ss3-signal-title">{t('recoveryAlert', lang)}</p>
              {customerBreakdown && (
                <p className="ss3-signal-sub">
                  {customerBreakdown === 'misunderstood'
                    ? t('visitorFeelingMisunderstood', lang)
                    : t('visitorFeelingStuck', lang)}
                </p>
              )}
            </div>
          </div>

          <p className="ss3-repair-intro">{t('loopRepairIntro', lang)}</p>

          <div className="ss3-visitor-need">
            <span className="ss3-vn-label">{t('visitorNeedsSup', lang)}</span>
            <span className="ss3-vn-text">{recoveryOpt.en}
              {getSecondary(recoveryOpt.id, customerLang) && (
                <span className="ss3-vn-native"> / {getSecondary(recoveryOpt.id, customerLang)}</span>
              )}
            </span>
          </div>

          <div className="ss3-say-card">
            <span className="ss3-say-label">◎ {t('suggestedStaffResp', lang)}</span>
            <p className="ss3-say-text">"{staffResponse}"</p>
          </div>
        </>
      ) : (
        /* ── No signal — show loop repair tools ── */
        <>
          <div className="ss3-general-header">
            <span className="ss3-general-icon">↺</span>
            <div>
              <p className="ss3-general-title">{t('generalGuidance', lang)}</p>
              <p className="ss3-general-sub">{t('loopRepairIntro', lang)}</p>
            </div>
          </div>
          <div className="ss3-tips">
            {quickTips.map(tip => (
              <button
                key={tip.id}
                className={`ss3-tip ${usedTip === tip.id ? 'ss3-tip--used' : ''}`}
                onClick={() => setUsedTip(tip.id)}
              >
                <div className="ss3-tip-top">
                  <span className="ss3-tip-icon">{tip.icon}</span>
                  <span className="ss3-tip-title">{tip.title}</span>
                  {usedTip === tip.id && <span className="ss3-tip-done">✓ used</span>}
                </div>
                <p className="ss3-tip-phrase">"{tip.phrase}"</p>
              </button>
            ))}
          </div>
        </>
      )}

      <button className="ss2-back-btn" onClick={() => goTo(1)}>← {t('backToDash', lang)}</button>
    </div>
  )
}

/* ─────────────────────────────────────────────
   SS4 — Next Step Summary Builder
───────────────────────────────────────────── */
function SS4({ goTo, selectedNeeds, staffSummaryShared, onSendToCustomer, lang }) {
  const summaryParts = generateSummaryParts(selectedNeeds)
  const needLabels   = NEEDS_OPTIONS.filter(o => selectedNeeds.includes(o.id))

  return (
    <div className="ss4-root screen-enter">

      {/* Header */}
      <div className="ss4-header">
        <span className="ss4-title">{t('ss4Title', lang)}</span>
        {staffSummaryShared && (
          <span className="ss4-sent-badge">✓ {t('sentToVisitor', lang)}</span>
        )}
      </div>

      {/* What was clarified together */}
      <div className="ss4-section">
        <p className="ss4-section-label">◎ {t('hereIsUnderstood', lang)}</p>
        <p className="ss4-shared-note">{t('sharedMeaningNote', lang)}</p>
        <div className="ss4-understood">
          <div className="ss4-need-pills">
            {needLabels.map(n => (
              <span key={n.id} className="ss4-need-pill">{n.emoji} {n.en}</span>
            ))}
          </div>
          {summaryParts.map((p, i) => (
            <p key={i} className="ss4-summary-line">{p}</p>
          ))}
        </div>
      </div>

      {/* Next steps */}
      <div className="ss4-section">
        <p className="ss4-section-label">∞ {t('nextStepsLabel', lang)}</p>
        <div className="ss4-steps">
          {NEXT_STEPS.map(s => (
            <div key={s.n} className="ss4-step">
              <span className="ss4-step-num">{s.n}</span>
              <div className="ss4-step-body">
                <span className="ss4-step-en">{s.en}</span>
                {s.zh && <span className="ss4-step-zh">{s.zh}</span>}
              </div>
              <span className="ss4-step-emoji">{s.emoji}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="ss4-actions">
        {!staffSummaryShared ? (
          <button className="ss4-send-btn" onClick={onSendToCustomer}>
            ✦ {t('sendToCustomer', lang)}
          </button>
        ) : (
          <div className="ss4-sent-confirm">
            <span className="ss4-sent-icon">∞</span>
            <span>{t('summarySent', lang)}</span>
          </div>
        )}
        <div className="ss4-secondary-btns">
          <button className="ss2-back-btn" onClick={() => goTo(1)}>← {t('backToDash', lang)}</button>
          <button className="ss2-back-btn" onClick={() => window.print()}>🖨️ {t('printLbl', lang)}</button>
        </div>
      </div>

    </div>
  )
}

/* ─────────────────────────────────────────────
   Splash Screen — MeaningBloom Opening Moment
───────────────────────────────────────────── */
function SplashScreen({ onEnter }) {
  const [exiting, setExiting] = useState(false)

  const go  = () => { setExiting(true); setTimeout(onEnter, 900) }
  const skip = () => onEnter()

  return (
    <div className={`splash${exiting ? ' splash--exit' : ''}`} role="main">
      <button className="splash-skip" onClick={skip} aria-label="Skip intro">Skip</button>

      <div className="splash-field" aria-hidden="true">
        <div className="s-orb s-orb-1" />
        <div className="s-orb s-orb-2" />
        <div className="s-orb s-orb-3" />
        <div className="s-center-wrap">
          <div className="s-center" />
        </div>
      </div>

      <div className="splash-content">
        <span className="splash-mark" aria-hidden="true">✦</span>
        <p className="splash-brand">MeaningBloom</p>
        <p className="splash-tagline">Let meaning unfold beyond fragmented English.</p>
        <p className="splash-phrase">Fragmented English does not mean fragmented thinking.</p>
        <button className="splash-enter" onClick={go}>Begin</button>
      </div>
    </div>
  )
}
