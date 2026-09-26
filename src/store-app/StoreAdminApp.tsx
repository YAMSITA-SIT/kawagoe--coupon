import { useMemo, useState } from 'react';
import { ALL_COUPONS } from '../data/coupons';
import type { Coupon, Shop } from '../types';

type StoreCoupon = Coupon & {
    isPublished: boolean;
};

type AdminTabKey = 'new' | 'registered';

const couponTypeLabels = {
    time: { ja: '毎日利用できるクーポン', en: 'Daily coupon' },
    food_loss: { ja: '当日限定クーポン', en: 'Same-day limited coupon' },
} as const;

type CouponFormState = {
    type: 'time' | 'food_loss';
    shopNameJa: string;
    shopNameEn: string;
    categoryJa: string;
    categoryEn: string;
    titleJa: string;
    titleEn: string;
    descriptionJa: string;
    descriptionEn: string;
    discountBadgeJa: string;
    discountBadgeEn: string;
    discountPercent: number;
    originalPrice: number | '';
    discountPrice: number | '';
    imageUrl: string;
    timeSlotJa: string;
    timeSlotEn: string;
    startTime: string;
    endTime: string;
    dayRule: 'all' | 'weekday_only' | 'weekend_only' | 'weekend_holiday';
    timeWindows: Array<'morning' | 'afternoon' | 'night'>;
    offPeakReasonJa: string;
    offPeakReasonEn: string;
    remainingStock: number;
    foodLossDeadline: string;
    rating: number;
    reviewCount: number;
    isPublished: boolean;
};

const baseShop: Shop = {
    ...ALL_COUPONS[0].shop,
    id: 'shop-admin-base',
    nameJa: '川越お茶専門店',
    nameEn: 'Kawagoe Ocha Senmon Ten',
    categoryJa: '飲食・和菓子',
    categoryEn: 'Dining & Sweets',
    distanceFromStationJa: '川越駅から徒歩12分',
    distanceFromStationEn: '12 min on foot from Kawagoe Station',
    walkingMinutes: 12,
    areaJa: '一番街・蔵造りエリア',
    areaEn: 'Kawagoe Main Street',
    addressJa: '埼玉県川越市蔵造り町1-2-3',
    addressEn: '1-2-3 Kurazukuri-cho, Kawagoe, Saitama',
    accessTipJa: '駅前から市内を巡る散策ルートの中間地点です。',
    accessTipEn: 'A convenient stop on the walking route through central Kawagoe.',
    mapCoords: { x: 58, y: 41 },
    dietaryFeatures: ['vegetarian', 'english_menu', 'cashless'],
};

const createBlankDraft = (): CouponFormState => ({
    type: 'time',
    shopNameJa: '川越お茶専門店',
    shopNameEn: 'Kawagoe Ocha Senmon Ten',
    categoryJa: '',
    categoryEn: '',
    titleJa: '',
    titleEn: '',
    descriptionJa: '',
    descriptionEn: '',
    discountBadgeJa: '',
    discountBadgeEn: '',
    discountPercent: 0,
    originalPrice: 0,
    discountPrice: 0,
    imageUrl: '',
    timeSlotJa: '',
    timeSlotEn: '',
    startTime: '10:00',
    endTime: '15:00',
    dayRule: 'all',
    timeWindows: [],
    offPeakReasonJa: '',
    offPeakReasonEn: '',
    remainingStock: 0,
    foodLossDeadline: '',
    rating: 0,
    reviewCount: 0,
    isPublished: false,
});

const toSlug = (value: string) => {
    const normalized = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') || 'shop';
    return `${normalized}-${Date.now().toString().slice(-4)}`;
};

const calculateDiscountPercent = (originalPrice: number | '', discountPrice: number | '') => {
    const numericOriginal = Number(originalPrice) || 0;
    const numericDiscount = Number(discountPrice) || 0;
    if (!numericOriginal || !numericDiscount || numericOriginal <= numericDiscount) return 0;
    return Math.round(((numericOriginal - numericDiscount) / numericOriginal) * 100);
};

const buildHourOptions = () => Array.from({ length: 24 }, (_, index) => String(index).padStart(2, '0'));
const buildMinuteOptions = () => ['00', '15', '30', '45'];

const parseTimeToMinutes = (value: string) => {
    if (!value || !value.includes(':')) return null;
    const [hourText, minuteText] = value.split(':');
    const hour = Number(hourText);
    const minute = Number(minuteText);
    if (Number.isNaN(hour) || Number.isNaN(minute)) return null;
    return hour * 60 + minute;
};

const inferTimeWindows = (startTime: string, endTime: string): Array<'morning' | 'afternoon' | 'night'> => {
    const startMinutes = parseTimeToMinutes(startTime);
    const endMinutes = parseTimeToMinutes(endTime);
    if (startMinutes === null || endMinutes === null) return [];

    const windows: Array<'morning' | 'afternoon' | 'night'> = [];
    const morningRange = [8 * 60, 12 * 60];
    const afternoonRange = [12 * 60, 17 * 60];
    const nightRange = [19 * 60, 22 * 60];

    const overlapsRange = (rangeStart: number, rangeEnd: number) => !(endMinutes <= rangeStart || startMinutes >= rangeEnd);

    if (overlapsRange(morningRange[0], morningRange[1])) windows.push('morning');
    if (overlapsRange(afternoonRange[0], afternoonRange[1])) windows.push('afternoon');
    if (overlapsRange(nightRange[0], nightRange[1])) windows.push('night');

    return windows;
};

const buildReadableTimeRange = (dayRule: CouponFormState['dayRule'], startTime: string, endTime: string) => {
    const dayLabelMap = {
        all: '毎日',
        weekday_only: '平日',
        weekend_only: '土日',
        weekend_holiday: '土日祝',
    } as const;

    const dayLabel = dayLabelMap[dayRule] ?? '毎日';
    return `${dayLabel} ${startTime}〜${endTime}`;
};

const validateDraftForRequiredFields = (draft: CouponFormState): string | null => {
    if (!draft.categoryJa.trim()) return 'カテゴリ（JA）は必須です。';
    if (!draft.titleJa.trim()) return 'タイトル（JA）は必須です。';
    if (!draft.descriptionJa.trim()) return '説明（JA）は必須です。';
    if (!draft.discountBadgeJa.trim()) return '割引表示（JA）は必須です。';
    if (typeof draft.originalPrice !== 'number' || draft.originalPrice <= 0) return '通常価格（税込）は必須です。';
    if (typeof draft.discountPrice !== 'number' || draft.discountPrice <= 0) return '割引後価格（税込）は必須です。';
    if (draft.type === 'time') {
        if (!draft.dayRule) return '適用日を選択してください。';
        if (!draft.startTime || !draft.endTime) return '開始時刻と終了時刻を入力してください。';
        if (parseTimeToMinutes(draft.startTime) === null || parseTimeToMinutes(draft.endTime) === null) {
            return '時刻は HH:MM 形式で入力してください。';
        }
        if (parseTimeToMinutes(draft.startTime)! >= parseTimeToMinutes(draft.endTime)!) {
            return '終了時刻は開始時刻より後にしてください。';
        }
    }
    if (draft.type === 'food_loss' && !draft.foodLossDeadline.trim()) return '当日限定の終了時刻は必須です。';
    if (draft.type === 'food_loss' && (!draft.remainingStock || draft.remainingStock <= 0)) return '当日限定クーポンの在庫数は必須です。';
    return null;
};

const buildCouponFromDraft = (draft: CouponFormState, existingId?: string): StoreCoupon => {
    const shopId = toSlug(draft.shopNameJa || 'shop');
    const couponId = existingId ?? `coupon-${Date.now()}`;

    const computedPercent = calculateDiscountPercent(draft.originalPrice, draft.discountPrice);
    const numericOriginalPrice = typeof draft.originalPrice === 'number' ? draft.originalPrice : 0;
    const numericDiscountPrice = typeof draft.discountPrice === 'number' ? draft.discountPrice : 0;
    const inferredTimeWindows = inferTimeWindows(draft.startTime, draft.endTime);
    const readableTimeRangeJa = buildReadableTimeRange(draft.dayRule, draft.startTime, draft.endTime);
    const readableTimeRangeEn = buildReadableTimeRange(draft.dayRule, draft.startTime, draft.endTime).replace('平日', 'Weekday').replace('土日', 'Weekend').replace('土日祝', 'Weekend & Holiday').replace('いつでも', 'Any day');
    const normalizedDraft = {
        ...draft,
        discountPercent: computedPercent,
        timeWindows: inferredTimeWindows.length > 0 ? inferredTimeWindows : draft.timeWindows,
        timeSlotJa: readableTimeRangeJa,
        timeSlotEn: readableTimeRangeEn,
        discountBadgeJa: computedPercent > 0 ? `${computedPercent}% OFF` : draft.discountBadgeJa,
        discountBadgeEn: computedPercent > 0 ? `${computedPercent}% OFF` : draft.discountBadgeEn,
    };

    const shop: Shop = {
        ...baseShop,
        id: shopId,
        nameJa: draft.shopNameJa || baseShop.nameJa,
        nameEn: draft.shopNameEn || baseShop.nameEn,
        categoryJa: draft.categoryJa || baseShop.categoryJa,
        categoryEn: draft.categoryEn || baseShop.categoryEn,
        mapCoords: { x: 60, y: 40 },
    };

    const coupon: StoreCoupon = {
        id: couponId,
        shopId,
        type: normalizedDraft.type,
        titleJa: normalizedDraft.titleJa || 'タイトル未設定',
        titleEn: normalizedDraft.titleEn || 'Untitled coupon',
        descriptionJa: normalizedDraft.descriptionJa || '説明文を入力してください。',
        descriptionEn: normalizedDraft.descriptionEn || 'Please add a description.',
        discountBadgeJa: normalizedDraft.discountBadgeJa || 'キャンペーン',
        discountBadgeEn: normalizedDraft.discountBadgeEn || 'Campaign',
        discountPercent: normalizedDraft.discountPercent,
        originalPrice: numericOriginalPrice,
        discountPrice: numericDiscountPrice,
        imageUrl: normalizedDraft.imageUrl || '/src/assets/images/tea.png',
        timeSlotJa: normalizedDraft.type === 'time' ? normalizedDraft.timeSlotJa : undefined,
        timeSlotEn: normalizedDraft.type === 'time' ? normalizedDraft.timeSlotEn : undefined,
        startTime: normalizedDraft.type === 'time' ? normalizedDraft.startTime : undefined,
        endTime: normalizedDraft.type === 'time' ? normalizedDraft.endTime : undefined,
        dayRule: normalizedDraft.type === 'time' ? normalizedDraft.dayRule : undefined,
        timeWindows: normalizedDraft.type === 'time' ? normalizedDraft.timeWindows : undefined,
        offPeakReasonJa: normalizedDraft.type === 'time' ? normalizedDraft.offPeakReasonJa : undefined,
        offPeakReasonEn: normalizedDraft.type === 'time' ? normalizedDraft.offPeakReasonEn : undefined,
        remainingStock: normalizedDraft.type === 'food_loss' ? normalizedDraft.remainingStock : undefined,
        foodLossDeadline: normalizedDraft.type === 'food_loss' ? normalizedDraft.foodLossDeadline : undefined,
        rating: normalizedDraft.rating,
        reviewCount: normalizedDraft.reviewCount,
        shop,
        isPublished: normalizedDraft.isPublished,
    };

    return coupon;
};

export function StoreAdminApp() {
    const [coupons, setCoupons] = useState<StoreCoupon[]>(() => {
        const sampleCoupons: StoreCoupon[] = [
            {
                id: 'tea-default-1',
                shopId: 'shop-tea-1',
                type: 'time',
                titleJa: '【平日限定】宇治抹茶ラテ 20%OFF',
                titleEn: 'Weekday Matcha Latte 20% OFF',
                descriptionJa: '濃厚な宇治抹茶とミルクのハーモニーを、静かな茶席でゆっくりお楽しみいただけます。',
                descriptionEn: 'A rich matcha latte experience with a smooth, creamy finish and a calming tea-house atmosphere.',
                discountBadgeJa: '20%OFF 平日限定',
                discountBadgeEn: '20% OFF Weekday Only',
                discountPercent: 20,
                originalPrice: 780,
                discountPrice: 624,
                imageUrl: '/src/assets/images/tea.png',
                timeSlotJa: '平日 11:00〜15:00',
                timeSlotEn: 'Weekdays 11:00 - 15:00',
                dayRule: 'weekday_only',
                timeWindows: ['afternoon'],
                offPeakReasonJa: 'ランチ前後の落ち着いた時間帯に向けた特別価格です。',
                offPeakReasonEn: 'A special offer for calmer hours before and after lunch rush.',
                rating: 4.9,
                reviewCount: 120,
                shop: {
                    ...baseShop,
                    id: 'shop-tea-1',
                    nameJa: '川越お茶専門店',
                    nameEn: 'Kawagoe Ocha Senmon Ten',
                    categoryJa: '飲食・和菓子',
                    categoryEn: 'Dining & Sweets',
                },
                isPublished: true,
            },
            {
                id: 'tea-default-2',
                shopId: 'shop-tea-2',
                type: 'time',
                titleJa: '【昼の一杯】深蒸し緑茶セット 15%OFF',
                titleEn: 'Midday Sencha Set 15% OFF',
                descriptionJa: '香り高い深蒸し緑茶に、季節の和菓子を添えた上品なセットです。',
                descriptionEn: 'A refined sencha set paired with seasonal sweets for a balanced midday tea break.',
                discountBadgeJa: '15%OFF 昼限定',
                discountBadgeEn: '15% OFF Lunch Set',
                discountPercent: 15,
                originalPrice: 980,
                discountPrice: 833,
                imageUrl: '/src/assets/images/tea.png',
                timeSlotJa: '12:00〜14:00',
                timeSlotEn: '12:00 - 14:00',
                dayRule: 'weekday_only',
                timeWindows: ['afternoon'],
                offPeakReasonJa: '昼休みの短い時間でもゆっくり楽しめる内容です。',
                offPeakReasonEn: 'A compact tea set designed for a relaxing lunch break.',
                rating: 4.8,
                reviewCount: 86,
                shop: {
                    ...baseShop,
                    id: 'shop-tea-2',
                    nameJa: '川越お茶専門店',
                    nameEn: 'Kawagoe Ocha Senmon Ten',
                    categoryJa: '飲食・和菓子',
                    categoryEn: 'Dining & Sweets',
                },
                isPublished: true,
            },
            {
                id: 'tea-default-3',
                shopId: 'shop-tea-3',
                type: 'time',
                titleJa: '【香ばし茶】ほうじ茶フロート 25%OFF',
                titleEn: 'Roasted Hojicha Float 25% OFF',
                descriptionJa: '香ばしいほうじ茶とアイスクリームの甘味がほどよくマッチした、やさしい後味の一杯です。',
                descriptionEn: 'A gently roasted hojicha float with a deep, mellow aroma and a smooth finish.',
                discountBadgeJa: '25%OFF ほうじ茶',
                discountBadgeEn: '25% OFF Hojicha',
                discountPercent: 25,
                originalPrice: 720,
                discountPrice: 540,
                imageUrl: '/src/assets/images/tea.png',
                timeSlotJa: '昼〜夕方',
                timeSlotEn: 'Afternoon to evening',
                dayRule: 'all',
                timeWindows: ['afternoon'],
                offPeakReasonJa: '午後の休憩時間におすすめの軽やかな甘味です。',
                offPeakReasonEn: 'A light and aromatic tea-time treat for late afternoon breaks.',
                rating: 4.7,
                reviewCount: 74,
                shop: {
                    ...baseShop,
                    id: 'shop-tea-3',
                    nameJa: '川越お茶専門店',
                    nameEn: 'Kawagoe Ocha Senmon Ten',
                    categoryJa: '飲食・和菓子',
                    categoryEn: 'Dining & Sweets',
                },
                isPublished: true,
            },
            {
                id: 'tea-default-4',
                shopId: 'shop-tea-4',
                type: 'food_loss',
                titleJa: '【当日限定】麦茶と和菓子のセット',
                titleEn: 'Today Only Barley Tea & Wagashi Set',
                descriptionJa: 'さわやかな麦茶に、季節の和菓子を合わせた当日限定の軽食セットです。',
                descriptionEn: 'A today-only set featuring refreshing barley tea and a seasonal wagashi pairing.',
                discountBadgeJa: '当日限定 30%OFF',
                discountBadgeEn: 'Today Only 30% OFF',
                discountPercent: 30,
                originalPrice: 860,
                discountPrice: 602,
                imageUrl: '/src/assets/images/tea.png',
                remainingStock: 8,
                foodLossDeadline: '18:30',
                rating: 4.6,
                reviewCount: 59,
                shop: {
                    ...baseShop,
                    id: 'shop-tea-4',
                    nameJa: '川越お茶専門店',
                    nameEn: 'Kawagoe Ocha Senmon Ten',
                    categoryJa: '飲食・和菓子',
                    categoryEn: 'Dining & Sweets',
                },
                isPublished: true,
            },
        ];

        return sampleCoupons;
    });

    const [draft, setDraft] = useState<CouponFormState>(() => createBlankDraft());
    const [editingId, setEditingId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<AdminTabKey>('new');
    const [selectedImageName, setSelectedImageName] = useState<string>('');
    const [showPublishedOnly, setShowPublishedOnly] = useState<boolean>(false);
    const [timePickerTarget, setTimePickerTarget] = useState<'start' | 'end' | null>(null);
    const [timePickerDraft, setTimePickerDraft] = useState<{ field: 'start' | 'end'; hour: string; minute: string } | null>(null);
    const [deleteConfirmTarget, setDeleteConfirmTarget] = useState<{ id: string; titleJa: string } | null>(null);
    const hourOptions = useMemo(() => buildHourOptions(), []);
    const minuteOptions = useMemo(() => buildMinuteOptions(), []);

    const dashboardStats = useMemo(() => {
        const published = coupons.filter((coupon) => coupon.isPublished).length;
        const draftCount = coupons.filter((coupon) => !coupon.isPublished).length;
        const total = coupons.length;
        const avgDiscount = Math.round(
            coupons.reduce((sum, coupon) => sum + (coupon.discountPercent ?? 0), 0) / Math.max(total, 1),
        );

        return { published, draftCount, total, avgDiscount };
    }, [coupons]);

    const updateDraft = <K extends keyof CouponFormState>(field: K, value: CouponFormState[K]) => {
        setDraft((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const openTimePicker = (field: 'start' | 'end') => {
        const currentValue = field === 'start' ? draft.startTime : draft.endTime;
        const { hour, minute } = getTimePartValues(currentValue);
        setTimePickerTarget(field);
        setTimePickerDraft({ field, hour, minute });
    };

    const closeTimePicker = () => {
        setTimePickerTarget(null);
        setTimePickerDraft(null);
    };

    const applyTimeSelection = (field: 'start' | 'end', hour: string, minute: string) => {
        updateDraft(field === 'start' ? 'startTime' : 'endTime', `${hour}:${minute}`);
        closeTimePicker();
    };

    const getTimePartValues = (value: string) => {
        const [hour = '09', minute = '00'] = (value || '09:00').split(':');
        return {
            hour: String(Number(hour)).padStart(2, '0'),
            minute: minute && ['00', '15', '30', '45'].includes(minute) ? minute : '00',
        };
    };

    const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const objectUrl = URL.createObjectURL(file);
        setSelectedImageName(file.name);
        updateDraft('imageUrl', objectUrl);
    };

    const handleSaveDraft = () => {
        const validationError = validateDraftForRequiredFields(draft);
        if (validationError) {
            alert(validationError);
            return;
        }

        const draftAsCoupon = buildCouponFromDraft({ ...draft, isPublished: false }, editingId ?? undefined);

        setCoupons((prev) => {
            if (editingId) {
                return prev.map((coupon) => (coupon.id === editingId ? { ...draftAsCoupon, id: editingId } : coupon));
            }
            return [draftAsCoupon, ...prev];
        });

        setSelectedImageName('');
        setEditingId(null);
        setDraft(createBlankDraft());
        setActiveTab('registered');
    };

    const handleSubmit = () => {
        const validationError = validateDraftForRequiredFields(draft);
        if (validationError) {
            alert(validationError);
            return;
        }

        const nextCoupon = buildCouponFromDraft(draft, editingId ?? undefined);

        setCoupons((prev) => {
            if (editingId) {
                return prev.map((coupon) => (coupon.id === editingId ? nextCoupon : coupon));
            }
            return [nextCoupon, ...prev];
        });

        setDraft(createBlankDraft());
        setSelectedImageName('');
        setEditingId(null);
        setActiveTab('registered');
    };

    const handleEdit = (coupon: StoreCoupon) => {
        setEditingId(coupon.id);
        setDraft({
            type: coupon.type,
            shopNameJa: coupon.shop.nameJa,
            shopNameEn: coupon.shop.nameEn,
            categoryJa: coupon.shop.categoryJa,
            categoryEn: coupon.shop.categoryEn,
            titleJa: coupon.titleJa,
            titleEn: coupon.titleEn,
            descriptionJa: coupon.descriptionJa,
            descriptionEn: coupon.descriptionEn,
            discountBadgeJa: coupon.discountBadgeJa,
            discountBadgeEn: coupon.discountBadgeEn,
            discountPercent: coupon.discountPercent ?? 0,
            originalPrice: coupon.originalPrice ?? 0,
            discountPrice: coupon.discountPrice,
            imageUrl: coupon.imageUrl,
            timeSlotJa: coupon.timeSlotJa ?? '',
            timeSlotEn: coupon.timeSlotEn ?? '',
            startTime: coupon.startTime ?? '10:00',
            endTime: coupon.endTime ?? '15:00',
            dayRule: coupon.dayRule ?? 'all',
            timeWindows: coupon.timeWindows ?? inferTimeWindows(coupon.startTime ?? '10:00', coupon.endTime ?? '15:00'),
            offPeakReasonJa: coupon.offPeakReasonJa ?? '',
            offPeakReasonEn: coupon.offPeakReasonEn ?? '',
            remainingStock: coupon.remainingStock ?? 0,
            foodLossDeadline: coupon.foodLossDeadline ?? '',
            rating: coupon.rating,
            reviewCount: coupon.reviewCount,
            isPublished: coupon.isPublished,
        });
        setActiveTab('registered');
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setDraft(createBlankDraft());
        setSelectedImageName('');
    };

    const filteredCoupons = showPublishedOnly ? coupons.filter((coupon) => coupon.isPublished) : coupons;

    const handleDelete = (couponId: string) => {
        const targetCoupon = coupons.find((coupon) => coupon.id === couponId);
        if (!targetCoupon) return;
        setDeleteConfirmTarget({ id: couponId, titleJa: targetCoupon.titleJa });
    };

    const confirmDelete = () => {
        if (!deleteConfirmTarget) return;

        setCoupons((prev) => prev.filter((coupon) => coupon.id !== deleteConfirmTarget.id));
        if (editingId === deleteConfirmTarget.id) {
            setEditingId(null);
            setDraft(createBlankDraft());
        }
        setDeleteConfirmTarget(null);
    };

    const handleDuplicate = (coupon: StoreCoupon) => {
        const duplicated = {
            ...coupon,
            id: `coupon-${Date.now()}`,
            shopId: `${coupon.shopId}-copy`,
            titleJa: `${coupon.titleJa}（複製）`,
            titleEn: `${coupon.titleEn} (Copy)`,
            descriptionJa: '静かな茶席で味わう和のひととき。お茶と和菓子の組み合わせを、季節に合わせてお楽しみください。',
            descriptionEn: 'A tranquil tea moment with seasonal sweets and carefully brewed tea.',
            isPublished: false,
        };
        setCoupons((prev) => [duplicated, ...prev]);
        setActiveTab('registered');
    };

    const handleTogglePublish = (couponId: string) => {
        setCoupons((prev) =>
            prev.map((coupon) =>
                coupon.id === couponId ? { ...coupon, isPublished: !coupon.isPublished } : coupon,
            ),
        );
    };

    return (
        <div className="min-h-screen bg-[#f6f1ea] p-4 text-stone-800 md:p-8">
            {deleteConfirmTarget && (
                <div className="fixed inset-0 z-50 flex items-end justify-center bg-stone-950/45 p-4 sm:items-center">
                    <div className="w-full max-w-sm rounded-[28px] border border-stone-200 bg-white p-5 shadow-2xl">
                        <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-2xl">⚠️</div>
                        <h3 className="text-xl font-black text-stone-900">削除しますか？</h3>
                        <p className="mt-2 text-sm leading-6 text-stone-600">
                            「{deleteConfirmTarget.titleJa}」を削除すると、登録済みデータは元に戻せません。
                        </p>
                        <div className="mt-5 flex gap-2">
                            <button
                                type="button"
                                onClick={() => setDeleteConfirmTarget(null)}
                                className="flex-1 rounded-2xl border border-stone-300 bg-stone-100 px-4 py-3 text-sm font-bold text-stone-700"
                            >
                                キャンセル
                            </button>
                            <button
                                type="button"
                                onClick={confirmDelete}
                                className="flex-1 rounded-2xl bg-rose-500 px-4 py-3 text-sm font-black text-white shadow-sm"
                            >
                                削除する
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="mx-auto max-w-7xl">
                <header className="mb-6 flex flex-col gap-3 rounded-[28px] bg-gradient-to-r from-[#4a2d2d] via-[#7b4a36] to-[#d98b54] p-5 text-white shadow-lg md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-100/80">Store Admin</p>
                        <h1 className="mt-2 text-2xl font-black tracking-tight">川越お茶専門店 管理画面</h1>
                    </div>
                    <div className="flex items-center gap-3 rounded-full bg-white/10 px-3 py-2 text-sm backdrop-blur-sm">
                        <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
                        現在の公開状況: {dashboardStats.published}件公開中
                    </div>
                </header>

                <div className="mb-6 grid gap-4 md:grid-cols-4">
                    <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">Total</p>
                        <p className="mt-3 text-3xl font-black text-stone-800">{dashboardStats.total}</p>
                    </div>
                    <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">Published</p>
                        <p className="mt-3 text-3xl font-black text-emerald-600">{dashboardStats.published}</p>
                    </div>
                    <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">Draft</p>
                        <p className="mt-3 text-3xl font-black text-amber-600">{dashboardStats.draftCount}</p>
                    </div>
                    <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">Avg Discount</p>
                        <p className="mt-3 text-3xl font-black text-stone-800">{dashboardStats.avgDiscount}%</p>
                    </div>
                </div>

                <div className="mb-4 flex rounded-full bg-stone-200 p-1">
                    <button
                        type="button"
                        onClick={() => {
                            handleCancelEdit();
                            setActiveTab('new');
                        }}
                        className={`flex-1 rounded-full px-4 py-2.5 text-sm font-bold transition ${activeTab === 'new' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600'}`}
                    >
                        新規作成
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('registered')}
                        className={`flex-1 rounded-full px-4 py-2.5 text-sm font-bold transition ${activeTab === 'registered' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600'}`}
                    >
                        登録済み
                    </button>
                </div>

                {activeTab === 'new' || (activeTab === 'registered' && editingId) ? (
                    <div className="rounded-[28px] border border-stone-200 bg-white p-4 shadow-sm md:p-5">
                        <div className="mb-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">Form</p>
                            <h2 className="mt-1 text-xl font-black text-stone-800">
                                {editingId ? 'クーポン編集' : '新規クーポン登録'}
                            </h2>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">クーポン種別</label>
                                <select
                                    value={draft.type}
                                    onChange={(e) => updateDraft('type', e.target.value as 'time' | 'food_loss')}
                                    className="w-full rounded-xl border border-stone-300 bg-stone-50 px-3 py-2.5 text-sm outline-none transition focus:border-amber-500"
                                >
                                    <option value="time">{couponTypeLabels.time.ja}</option>
                                    <option value="food_loss">{couponTypeLabels.food_loss.ja}</option>
                                </select>
                            </div>

                            <div className="rounded-xl border border-stone-200 bg-stone-50 p-3">
                                <div className="mb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-500">店舗名</div>
                                <div className="text-base font-black text-stone-800">{draft.shopNameJa}</div>
                                <div className="text-sm text-stone-500">{draft.shopNameEn}</div>
                            </div>

                            <div>
                                <div className="mb-1 flex items-center justify-between gap-2">
                                    <label className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">カテゴリ（JA）</label>
                                    <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-700">必須</span>
                                </div>
                                <input
                                    value={draft.categoryJa}
                                    onChange={(e) => updateDraft('categoryJa', e.target.value)}
                                    placeholder="例：和カフェ・和菓子"
                                    required
                                    className="w-full rounded-xl border border-stone-300 bg-stone-50 px-3 py-2.5 text-sm outline-none transition placeholder:text-stone-400 focus:border-amber-500"
                                />
                            </div>

                            <div>
                                <div className="mb-1 flex items-center justify-between gap-2">
                                    <label className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">カテゴリ（EN）</label>
                                    <span className="rounded-full bg-stone-200 px-2 py-0.5 text-[10px] font-bold text-stone-600">任意</span>
                                </div>
                                <input
                                    value={draft.categoryEn}
                                    onChange={(e) => updateDraft('categoryEn', e.target.value)}
                                    placeholder="例：Japanese Cafe & Sweets"
                                    className="w-full rounded-xl border border-dashed border-stone-300 bg-stone-50 px-3 py-2.5 text-sm outline-none transition placeholder:text-stone-400 focus:border-amber-500"
                                />
                            </div>

                            <div className="rounded-2xl border border-dashed border-stone-300 bg-stone-50 p-3">
                                <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-500">画像アップロード</div>
                                {draft.imageUrl ? (
                                    <div className="mb-3 overflow-hidden rounded-2xl border border-stone-200 bg-white">
                                        <img src={draft.imageUrl} alt="coupon preview" className="h-36 w-full object-cover" />
                                    </div>
                                ) : null}
                                <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-stone-200 bg-white px-3 py-5 text-center transition hover:border-amber-300 hover:bg-amber-50">
                                    <span className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-full bg-stone-100 text-xl">🖼️</span>
                                    <span className="text-sm font-semibold text-stone-700">画像を選択</span>
                                    <span className="mt-1 text-[11px] text-stone-500">PNG / JPG / WEBP</span>
                                    <input type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
                                </label>
                                {selectedImageName ? (
                                    <div className="mt-2 text-[11px] text-stone-500">選択中: {selectedImageName}</div>
                                ) : null}
                            </div>

                            <div>
                                <div className="mb-1 flex items-center justify-between gap-2">
                                    <label className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">割引表示（JA）</label>
                                    <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-700">必須</span>
                                </div>
                                <input
                                    value={draft.discountBadgeJa}
                                    onChange={(e) => updateDraft('discountBadgeJa', e.target.value)}
                                    placeholder="例：20% OFF 平日限定"
                                    required
                                    className="w-full rounded-xl border border-stone-300 bg-stone-50 px-3 py-2.5 text-sm outline-none transition placeholder:text-stone-400 focus:border-amber-500"
                                />
                            </div>

                            <div>
                                <div className="mb-1 flex items-center justify-between gap-2">
                                    <label className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">割引表示（EN）</label>
                                    <span className="rounded-full bg-stone-200 px-2 py-0.5 text-[10px] font-bold text-stone-600">任意</span>
                                </div>
                                <input
                                    value={draft.discountBadgeEn}
                                    onChange={(e) => updateDraft('discountBadgeEn', e.target.value)}
                                    placeholder="例：20% OFF Weekday Special"
                                    className="w-full rounded-xl border border-dashed border-stone-300 bg-stone-50 px-3 py-2.5 text-sm outline-none transition placeholder:text-stone-400 focus:border-amber-500"
                                />
                            </div>

                            <div>
                                <div className="mb-1 flex items-center justify-between gap-2">
                                    <label className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">タイトル（JA）</label>
                                    <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-700">必須</span>
                                </div>
                                <input
                                    value={draft.titleJa}
                                    onChange={(e) => updateDraft('titleJa', e.target.value)}
                                    placeholder="例：平日限定の抹茶ラテ"
                                    required
                                    className="w-full rounded-xl border border-stone-300 bg-stone-50 px-3 py-2.5 text-sm outline-none transition placeholder:text-stone-400 focus:border-amber-500"
                                />
                            </div>

                            <div>
                                <div className="mb-1 flex items-center justify-between gap-2">
                                    <label className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">タイトル（EN）</label>
                                    <span className="rounded-full bg-stone-200 px-2 py-0.5 text-[10px] font-bold text-stone-600">任意</span>
                                </div>
                                <input
                                    value={draft.titleEn}
                                    onChange={(e) => updateDraft('titleEn', e.target.value)}
                                    placeholder="例：Weekday Matcha Latte 20% OFF"
                                    className="w-full rounded-xl border border-dashed border-stone-300 bg-stone-50 px-3 py-2.5 text-sm outline-none transition placeholder:text-stone-400 focus:border-amber-500"
                                />
                            </div>

                            <div>
                                <div className="mb-1 flex items-center justify-between gap-2">
                                    <label className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">説明（JA）</label>
                                    <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-700">必須</span>
                                </div>
                                <textarea
                                    value={draft.descriptionJa}
                                    onChange={(e) => updateDraft('descriptionJa', e.target.value)}
                                    rows={3}
                                    placeholder="例：落ち着いた茶席で、季節の和菓子とお茶をゆったり楽しめます。"
                                    required
                                    className="w-full rounded-xl border border-stone-300 bg-stone-50 px-3 py-2.5 text-sm outline-none transition placeholder:text-stone-400 focus:border-amber-500"
                                />
                            </div>

                            <div>
                                <div className="mb-1 flex items-center justify-between gap-2">
                                    <label className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">説明（EN）</label>
                                    <span className="rounded-full bg-stone-200 px-2 py-0.5 text-[10px] font-bold text-stone-600">任意</span>
                                </div>
                                <textarea
                                    value={draft.descriptionEn}
                                    onChange={(e) => updateDraft('descriptionEn', e.target.value)}
                                    rows={3}
                                    placeholder="例：Enjoy a calm tea break with seasonal sweets and a gentle afternoon atmosphere."
                                    className="w-full rounded-xl border border-dashed border-stone-300 bg-stone-50 px-3 py-2.5 text-sm outline-none transition placeholder:text-stone-400 focus:border-amber-500"
                                />
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">通常価格（税込）</label>
                                    <input
                                        type="number"
                                        value={draft.originalPrice === '' ? '' : draft.originalPrice}
                                        onChange={(e) => {
                                            const rawValue = e.target.value;
                                            const nextValue = rawValue === '' ? '' : Number(rawValue);
                                            updateDraft('originalPrice', nextValue);
                                            const calculated = calculateDiscountPercent(nextValue, draft.discountPrice);
                                            updateDraft('discountPercent', calculated);
                                        }}
                                        placeholder="例：1200"
                                        required
                                        className="w-full rounded-xl border border-stone-300 bg-stone-50 px-3 py-2.5 text-sm outline-none transition placeholder:text-stone-400 focus:border-amber-500"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">割引後価格（税込）</label>
                                    <input
                                        type="number"
                                        value={draft.discountPrice === '' ? '' : draft.discountPrice}
                                        onChange={(e) => {
                                            const rawValue = e.target.value;
                                            const nextValue = rawValue === '' ? '' : Number(rawValue);
                                            updateDraft('discountPrice', nextValue);
                                            const calculated = calculateDiscountPercent(draft.originalPrice, nextValue);
                                            updateDraft('discountPercent', calculated);
                                        }}
                                        placeholder="例：960"
                                        required
                                        className="w-full rounded-xl border border-stone-300 bg-stone-50 px-3 py-2.5 text-sm outline-none transition placeholder:text-stone-400 focus:border-amber-500"
                                    />
                                </div>
                            </div>

                            <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
                                <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-700">自動計算</div>
                                <div className="mt-1 text-lg font-black text-amber-900">割引率 {draft.discountPercent}%</div>
                            </div>

                            <div className="grid grid-cols-1 gap-3">
                                {draft.type === 'food_loss' && (
                                    <div>
                                        <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">在庫数</label>
                                        <input
                                            type="number"
                                            value={draft.remainingStock}
                                            onChange={(e) => updateDraft('remainingStock', Number(e.target.value))}
                                            className="w-full rounded-xl border border-stone-300 bg-stone-50 px-3 py-2.5 text-sm outline-none transition focus:border-amber-500"
                                        />
                                    </div>
                                )}
                            </div>

                            {draft.type === 'time' && (
                                <>
                                    <div>
                                        <div className="mb-1 flex items-center justify-between gap-2">
                                            <label className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">利用可能日</label>
                                            <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-700">必須</span>
                                        </div>
                                        <select
                                            value={draft.dayRule}
                                            onChange={(e) => updateDraft('dayRule', e.target.value as 'all' | 'weekday_only' | 'weekend_only' | 'weekend_holiday')}
                                            className="w-full rounded-xl border border-stone-300 bg-stone-50 px-3 py-2.5 text-sm outline-none transition focus:border-amber-500"
                                        >
                                            <option value="all">毎日</option>
                                            <option value="weekday_only">平日</option>
                                            <option value="weekend_only">土日</option>
                                            <option value="weekend_holiday">土日祝</option>
                                        </select>
                                    </div>

                                    <div className="space-y-3">
                                        <div>
                                            <div className="mb-1 flex items-center justify-between gap-2">
                                                <label className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">開始時刻</label>
                                                <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-700">必須</span>
                                            </div>
                                            <div className="relative">
                                                <div className="flex gap-2">
                                                    <input
                                                        type="text"
                                                        inputMode="numeric"
                                                        value={draft.startTime}
                                                        onChange={(e) => updateDraft('startTime', e.target.value)}
                                                        placeholder="09:00"
                                                        aria-label="開始時刻を手入力"
                                                        className="w-full rounded-xl border border-stone-300 bg-stone-50 px-3 py-2.5 text-sm outline-none transition placeholder:text-stone-400 focus:border-amber-500"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => openTimePicker('start')}
                                                        className="flex h-[44px] w-[44px] items-center justify-center rounded-xl border border-stone-300 bg-stone-100 text-lg transition hover:bg-stone-200"
                                                        aria-label="開始時刻を選択"
                                                    >
                                                        🕒
                                                    </button>
                                                </div>
                                                {timePickerTarget === 'start' && (
                                                    <div className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-2xl border border-stone-200 bg-white p-3 shadow-xl">
                                                        <div className="flex items-end gap-2">
                                                            <div className="flex-1">
                                                                <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-stone-500">時</div>
                                                                <select
                                                                    value={timePickerDraft?.field === 'start' ? timePickerDraft.hour : getTimePartValues(draft.startTime).hour}
                                                                    onChange={(e) => {
                                                                        setTimePickerDraft((prev) =>
                                                                            prev?.field === 'start'
                                                                                ? { ...prev, hour: e.target.value }
                                                                                : { field: 'start', hour: e.target.value, minute: getTimePartValues(draft.startTime).minute },
                                                                        );
                                                                    }}
                                                                    className="w-full rounded-xl border border-stone-300 bg-stone-50 px-2 py-2 text-sm outline-none transition focus:border-amber-500"
                                                                >
                                                                    {hourOptions.map((hour) => (
                                                                        <option key={hour} value={hour}>{hour}</option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                            <div className="pb-2 text-base font-bold text-stone-500">:</div>
                                                            <div className="flex-1">
                                                                <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-stone-500">分</div>
                                                                <select
                                                                    value={timePickerDraft?.field === 'start' ? timePickerDraft.minute : getTimePartValues(draft.startTime).minute}
                                                                    onChange={(e) => {
                                                                        setTimePickerDraft((prev) =>
                                                                            prev?.field === 'start'
                                                                                ? { ...prev, minute: e.target.value }
                                                                                : { field: 'start', hour: getTimePartValues(draft.startTime).hour, minute: e.target.value },
                                                                        );
                                                                    }}
                                                                    className="w-full rounded-xl border border-stone-300 bg-stone-50 px-2 py-2 text-sm outline-none transition focus:border-amber-500"
                                                                >
                                                                    {minuteOptions.map((minute) => (
                                                                        <option key={minute} value={minute}>{minute}</option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                        </div>
                                                        <div className="mt-3 flex gap-2">
                                                            <button
                                                                type="button"
                                                                onClick={closeTimePicker}
                                                                className="flex-1 rounded-xl border border-stone-300 bg-stone-100 px-3 py-2 text-sm font-bold text-stone-700"
                                                            >
                                                                キャンセル
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    if (timePickerDraft?.field === 'start') {
                                                                        applyTimeSelection('start', timePickerDraft.hour, timePickerDraft.minute);
                                                                    }
                                                                }}
                                                                className="flex-1 rounded-xl bg-gradient-to-r from-[#8b5e3c] to-[#d98b54] px-3 py-2 text-sm font-black text-white"
                                                            >
                                                                確定
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="mb-1 flex items-center justify-between gap-2">
                                                <label className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">終了時刻</label>
                                                <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-700">必須</span>
                                            </div>
                                            <div className="relative">
                                                <div className="flex gap-2">
                                                    <input
                                                        type="text"
                                                        inputMode="numeric"
                                                        value={draft.endTime}
                                                        onChange={(e) => updateDraft('endTime', e.target.value)}
                                                        placeholder="15:00"
                                                        aria-label="終了時刻を手入力"
                                                        className="w-full rounded-xl border border-stone-300 bg-stone-50 px-3 py-2.5 text-sm outline-none transition placeholder:text-stone-400 focus:border-amber-500"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => openTimePicker('end')}
                                                        className="flex h-[44px] w-[44px] items-center justify-center rounded-xl border border-stone-300 bg-stone-100 text-lg transition hover:bg-stone-200"
                                                        aria-label="終了時刻を選択"
                                                    >
                                                        🕒
                                                    </button>
                                                </div>
                                                {timePickerTarget === 'end' && (
                                                    <div className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-2xl border border-stone-200 bg-white p-3 shadow-xl">
                                                        <div className="flex items-end gap-2">
                                                            <div className="flex-1">
                                                                <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-stone-500">時</div>
                                                                <select
                                                                    value={timePickerDraft?.field === 'end' ? timePickerDraft.hour : getTimePartValues(draft.endTime).hour}
                                                                    onChange={(e) => {
                                                                        setTimePickerDraft((prev) =>
                                                                            prev?.field === 'end'
                                                                                ? { ...prev, hour: e.target.value }
                                                                                : { field: 'end', hour: e.target.value, minute: getTimePartValues(draft.endTime).minute },
                                                                        );
                                                                    }}
                                                                    className="w-full rounded-xl border border-stone-300 bg-stone-50 px-2 py-2 text-sm outline-none transition focus:border-amber-500"
                                                                >
                                                                    {hourOptions.map((hour) => (
                                                                        <option key={hour} value={hour}>{hour}</option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                            <div className="pb-2 text-base font-bold text-stone-500">:</div>
                                                            <div className="flex-1">
                                                                <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-stone-500">分</div>
                                                                <select
                                                                    value={timePickerDraft?.field === 'end' ? timePickerDraft.minute : getTimePartValues(draft.endTime).minute}
                                                                    onChange={(e) => {
                                                                        setTimePickerDraft((prev) =>
                                                                            prev?.field === 'end'
                                                                                ? { ...prev, minute: e.target.value }
                                                                                : { field: 'end', hour: getTimePartValues(draft.endTime).hour, minute: e.target.value },
                                                                        );
                                                                    }}
                                                                    className="w-full rounded-xl border border-stone-300 bg-stone-50 px-2 py-2 text-sm outline-none transition focus:border-amber-500"
                                                                >
                                                                    {minuteOptions.map((minute) => (
                                                                        <option key={minute} value={minute}>{minute}</option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                        </div>
                                                        <div className="mt-3 flex gap-2">
                                                            <button
                                                                type="button"
                                                                onClick={closeTimePicker}
                                                                className="flex-1 rounded-xl border border-stone-300 bg-stone-100 px-3 py-2 text-sm font-bold text-stone-700"
                                                            >
                                                                キャンセル
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    if (timePickerDraft?.field === 'end') {
                                                                        applyTimeSelection('end', timePickerDraft.hour, timePickerDraft.minute);
                                                                    }
                                                                }}
                                                                className="flex-1 rounded-xl bg-gradient-to-r from-[#8b5e3c] to-[#d98b54] px-3 py-2 text-sm font-black text-white"
                                                            >
                                                                確定
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}

                            {draft.type === 'food_loss' && (
                                <div>
                                    <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">当日限定の終了時刻</label>
                                    <input
                                        value={draft.foodLossDeadline}
                                        onChange={(e) => updateDraft('foodLossDeadline', e.target.value)}
                                        placeholder="例：18:30"
                                        required
                                        className="w-full rounded-xl border border-stone-300 bg-stone-50 px-3 py-2.5 text-sm outline-none transition placeholder:text-stone-400 focus:border-amber-500"
                                    />
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={handleSaveDraft}
                                    className="rounded-2xl border border-stone-300 bg-stone-100 px-4 py-3 text-sm font-bold text-stone-700 transition hover:bg-stone-200"
                                >
                                    下書き保存
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    className="rounded-2xl bg-gradient-to-r from-[#8b5e3c] to-[#d98b54] px-4 py-3 text-sm font-black text-white shadow-md transition hover:brightness-105"
                                >
                                    {editingId ? '更新を保存' : 'クーポンを登録'}
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <section className="rounded-[28px] border border-stone-200 bg-white p-4 shadow-sm md:p-5">
                        <div className="mb-4 flex items-center justify-between gap-3">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">Coupon List</p>
                                <h2 className="mt-1 text-xl font-black text-stone-800">登録済みクーポン</h2>
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    handleCancelEdit();
                                    setActiveTab('new');
                                }}
                                className="rounded-full bg-stone-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-stone-700"
                            >
                                新規追加
                            </button>
                        </div>

                        <div className="mb-4 flex gap-2 rounded-full bg-stone-100 p-1">
                            <button
                                type="button"
                                onClick={() => setShowPublishedOnly(false)}
                                className={`flex-1 rounded-full px-3 py-2 text-xs font-bold transition ${!showPublishedOnly ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600'}`}
                            >
                                全件
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowPublishedOnly(true)}
                                className={`flex-1 rounded-full px-3 py-2 text-xs font-bold transition ${showPublishedOnly ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600'}`}
                            >
                                公開中のみ
                            </button>
                        </div>

                        <div className="space-y-4">
                            {filteredCoupons.map((coupon) => (
                                <div
                                    key={coupon.id}
                                    className="overflow-hidden rounded-[24px] border border-stone-200 bg-stone-50 transition hover:border-stone-300 hover:shadow-md"
                                >
                                    <div className="flex flex-col gap-4 p-4 md:flex-row">
                                        <div className="h-28 w-full overflow-hidden rounded-2xl bg-stone-200 md:w-28">
                                            <img
                                                src={coupon.imageUrl}
                                                alt={coupon.titleJa}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <div className="mb-2 flex flex-wrap items-center gap-2">
                                                <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-bold text-amber-800">
                                                    {coupon.type === 'time' ? couponTypeLabels.time.ja : couponTypeLabels.food_loss.ja}
                                                </span>
                                                <span className="rounded-full bg-stone-200 px-2.5 py-1 text-[10px] font-bold text-stone-700">
                                                    {coupon.isPublished ? '公開中' : '下書き'}
                                                </span>
                                                <span className="text-[10px] font-semibold text-stone-500">{coupon.shop.nameJa}</span>
                                            </div>

                                            <h3 className="text-lg font-black text-stone-900">{coupon.titleJa}</h3>
                                            <p className="mt-1 text-sm text-stone-600">{coupon.descriptionJa}</p>

                                            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-stone-600">
                                                <span className="rounded-full bg-white px-2 py-1 font-semibold">{coupon.discountBadgeJa}</span>
                                                <span>割引率 {coupon.discountPercent ?? 0}%</span>
                                                <span>通常 {coupon.originalPrice?.toLocaleString() ?? '-'}円</span>
                                                <span>特価 {coupon.discountPrice.toLocaleString()}円</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center justify-between gap-2 border-t border-stone-200 bg-white px-4 py-3">
                                        <div className="flex flex-wrap gap-2">
                                            <button
                                                type="button"
                                                onClick={() => handleEdit(coupon)}
                                                className="rounded-full border border-stone-300 px-3 py-1.5 text-xs font-semibold text-stone-700 transition hover:bg-stone-100"
                                            >
                                                編集
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleDuplicate(coupon)}
                                                className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-700 transition hover:bg-sky-100"
                                            >
                                                コピーして新規
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleTogglePublish(coupon.id)}
                                                className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100"
                                            >
                                                {coupon.isPublished ? '非公開にする' : '公開する'}
                                            </button>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => handleDelete(coupon.id)}
                                            className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-100"
                                        >
                                            削除
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}
