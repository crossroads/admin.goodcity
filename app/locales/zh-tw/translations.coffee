`import Ember from "ember"`
`import SharedTranslationsZhTw from "shared-goodcity/locales/zh-tw/translations"`

I18nTranslationsZhTw =
  Ember.$.extend true, SharedTranslationsZhTw,
    "socket_offline_error": "正在嘗試連線…"
    "reviewing": "正在審查"
    "reviewed": "已審查完畢"
    "submitted": "已提交"
    "messages_title" : "訊息"
    "select": "選擇"
    "cancel": "取消"
    "QuotaExceededError": "抱歉，此網站未能支援Safari <b> 私人瀏覽模式 </b> 請嘗試</br><ul><li><a href='https://itunes.apple.com/in/app/goodcityadmin.hk/id1013288708?mt=8' style='color: black!important; background-color: #dee4eb !important;'> iOS App 下載中 </a></li><li>正在使用Safari 正常(非無痕) 模式 </li><li> 正在使用Chrome 的私人瀏覽模式 </li></ul>"
    "search_item_label": "搜尋物資標籤"
    "designated_dispatched_error": "抱歉，您無法編輯已分配的項目！"
    "notes_en": "Notes EN"
    "notes_zh": "Notes 中文"
    "not_now" : "暫不決定"
    "save_changes": "儲存變更"
    "search":
      "no_results": "抱歉，未能找到結果！"
      "server_search": "於服務器上尋找更多資訊"
      "placeholder": "搜索"

    "inventory_options":
      "auto": "Auto Id"
      "input": "Input Id"
      "scan": "Scan Id"

    "users":
      "search": "搜尋使用者"

    "camera_scan":
      "permission_error": "未能取得相機鏡頭的權限。"

    "holiday":
      "name": "假期名稱"
      "date": "日期"
      "add": "增加"
      "manage": "管理假期"
      "description": "捐贈者將無法於「假期」內預約送貨！"
      "delete_confirm": "你確定要刪除此項假期嗎？"

    "chats":
      "no_recipient": "沒有收件人。本對話已失效"

    "offer":
      "title": "捐贈細節"
      "donor": "Details"
      "transport": "運輸"
      "details" : "捐贈詳情"
      "donor_messages" : "捐贈者信息"
      "supervisor_messages" : "監察員信息"
      "empty_msg" : "對不起！這項捐贈並不存在。"

      "merge":
        "title": "選擇捐贈項，將之合拼"
        "message": "合拼後無法還原。除了剛才點選的項目的一般討論外，所有數據皆會保留"
        "cancel": "取消"
        "merge": "合拼"
        "error": "無法合拼這幾個項目"

      "offer_details" :
        "heading" : "捐贈詳情"
        "is_collection": "收集"
        "is_drop_off": "送抵"
        "is_gogovan_order": "預約貨車"
        "is_gogovan_confirm": "確認貨車"
        "driver_completed": "司機已確認預約"
        "offer_messages": "一般信息"
        "accepted": "已接受"
        "not_needed": "不需要"
        "closed_offer_message": "不再接收這類物資捐贈，請見諒"
        "received": "已收到"
        "rejected": "已拒絕"
        "pending": "正在等候"
        "missing": "遺失"
        "submitted": "已提交"
        "start_receiving_by": "{{lastName}} {{firstName}} 正在接收"
        "inactive": "列作暫停"
    offer_sorts:
      sort_by: "排序",
      due_date: "到期日"
      create_date: "建立日期"
      oldest: "最舊"
      newest: "最新"
    offer_filters:
      time_presets:
        overdue: "已逾期",
        today: "今天",
        tomorrow: "明天",
        week: "本星期",
        next_week: "下星期",
        month: "本月",
        next_month: "下月"

      show_priority_offers: "只顯示 …"
      offer_statuses: "捐贈狀態"
      on_or_after: "在此日期或之後"
      on_or_before: "在此日期或之前"
      apply: "應用"
      clear: "清除"
      back: "返回"
      self_review: "我的"
      all_review: "全部"
      time_filter_title: "捐贈到期日"
      button_state: "狀態"
      priorityOffers: "優先的捐贈"
      priorityOffers_info: "在此狀態維持太長時間。需要跟進。"
      publishedOffers: "已發佈的捐贈"
      publishedOffers_info: "在好人好市慈善機構版網站分享"
      submitted: "新的"
      submitted_info: "等待審核的捐贈。"
      under_review: "審核中"
      under_review_info: "現正就捐贈進行審核。"
      reviewed: "已審核"
      reviewed_info: "需要排期的捐贈。"
      scheduled: "已排期"
      scheduled_info: "好人好市訂單已發出。"
      receiving: "接收中"
      receiving_info: "我們現正從貨車卸貨"
      received: "已接收"
      received_info: "成功"
      cancelled: "已取消"
      cancelled_info: "失敗"
      inactive: "非活躍"
      inactive_info: "捐贈者未有回應"

    "items":
      "title": "接收中-{{packageName}}"
      "remove_item":
        "confirmation_message": "你確定要取消這個項目嗎？"
        "yes": "是"
        "no": "否"
      "add_item":
        "description_placeholder" : "這是甚麼？有多少件物資？物資大小？"
        "quantity": "數量"
        "type": "類別"
        "add_images": "新增圖片"
        "description": "描述"
        "quality": "質量"
        "location": "位置"
        "size": "大小(厘米)"
        "labels": "標籤"
        "inventory": "庫存"
        "publish": "發佈"
        "receive": "接收"
        "print": "及列印 {{labels}}"
        "printer": "打印機"
      "validation":
        "dimensions": "提供三邊尺寸 (或不適用)"
        "quantity": "數量不能留空或為0。"
        "labels": "不能留空。"
        "max_lable_count": "最多300"
        "description": "描述不能留空。"
        "inventory_number": "庫存編號不能留空。"

    "item":
      "accepted": "已接受"
      "multiple_designation": "已分配"
      "all_dispatched": "缺貨"
      "submitted_status": "這項物品正在等候審查。"
      "in_review_status": "正在審查這項物品。"
      "accepted_status": "已接受這項物品。"
      "rejected_status": "不接受這項物品。"
      "cancelled_status": "這項捐贈已被 {{lastName}} {{firstName}} 取消。"

      "messages":
        "info_text1": "假如審查過程中我們遇到任何問題，我們會在下面的對話框向您查詢。"
        "info_text2": "假如您想添加任何有關捐贈物品的資料，請於下面的對話框輸入。"

    "dashboard":
      "title": "儀表板",
      "all_active_offers": "全部活躍捐贈"
      "my_active_offers": "我的活躍捐贈",
      "under_review": "審核中",
      "reviewed": "已審核",
      "scheduled": "已排期",
      "receiving": "接收中",
      "inactive": "非活躍",
      "cancelled": "已取消",
      "received": "已接收",
      "new_offers": "新的捐贈",
      "view_all_offers": "查看所有新捐贈"

    "inbox":
      "quick_links": "快捷鍵"
      "all_offers": "所有捐贈品"
      "create_offer": "Create offer"
      "notifications": "信息通知"
      "new_offers": "新捐獻項目"
      "new_items" : "新物資"
      "scheduled_offers": "已安排"
      "in_review" : "正在處理"
      "my_list" : "我的列表"
      "finished": "已完成"
      "closed_offers": "已完成"
      "receiving": "正在接收"
      "users": "使用者"
      "holidays": "假期"
      "search_offer_message": "只顯示最近更新的捐贈項目，請使用搜尋功能檢閱過往項目。"

    "my_notifications":
      "heading" : "{{name}}的捐贈"
      "all_notifications" : "所有新信息"
      "show_unread" : "顯示未讀信息"
      "mark_all_read" : "全部標示為已讀"
      "no_unread": "沒有未讀信息"

    "review_offer":
      "title" : "審查捐獻贈項目"
      "review_started_by" : "由 {{lastName}} {{firstName}} 發起"
      "no_items": "不需要任何物資"
      "close_offer": "此項捐贈不再開放"
      "items_reviewed": "已審查所有物資"
      "set_logistics": "設定運輸資料"
      "to_complete": "以完成"
      "plan_transport": "用戶可安排交通"
      "reviewed": "審查完畢"
      "start_review": "開始審查"
      "goods_received_by" : "已經收到由 {{firstName}} {{lastName}} 捐贈的物資"
      "goods_start_receiving_by": "{{firstName}} {{lastName}} 開始接收物資"
      "offer_closed_by": "捐贈項目由 {{firstName}} {{lastName}} 關閉"
      "offer_cancelled_by": "捐贈項目由 {{firstName}} {{lastName}} 取消"
      "receive": "收到"
      "share": "分享"
      "share_offer": "分享此捐贈"
      "sale_allowed": "這些物品可以被轉售"
      "sharing_notes_default": "有意申請的團體可表明需求的數量、日期及時間。"
      "sale_not_allowed": "這些物品不可被轉售"
      "offer_instructions_en": "捐贈教學 EN"
      "offer_instructions_zh": "捐贈教學 中文"
      "offer_instructions_details": "所有使用者都可以瀏覽此捐贈"
      "modify_sharing": "更改分享"
      "view_shared_offer": "View Share"
      "share_expired": "Share Expired"
      "share_offer_explanation": "讓本地註冊慈善團體查看及申請此捐贈"
      "private_sharing_mode_desc": "不要分享"
      "public_sharing_mode_desc": "透過網址分享"
      "public_listed_sharing_mode_desc": "透過網址分享 + 網站列表"
      "items_to_share": "分享的項目"
      "cannot_share_offer_without_packages": "不能分享沒有項目的捐贈"
      "select_all": "全選"
      "missing": "遺失"
      "received": "已經收到"
      "expecting": "等候中"
      "all_items_processed": "所有項目皆被接收或列作遺失"
      "inactive_offer": "這項捐贈已被暫停"
      "message_donor": "傳送信息給捐贈人士，告知其捐贈已被暫停："
      "confirm_receiving_message": "在捐贈取消後接收物資，會將捐贈項目的狀態轉成「正在接收」。確定接收物資嗎？"
      "close_offer_summary": "這項捐贈項目將列為完成。"
      "add_note": "按下以增加/修改記事板"
      "tap_to_save": "按下以儲存"
      "empty_offer_message": "這個捐贈沒有任何相關物資。你是否需要刪除"
      "update_offer_sharing": "更新捐贈分享"
      "include_in_listing": "包含在列表內"
      "share_offer_until": "分享捐贈至"
      "set_expiry_to_now": "設定到期日為現在"

      "share":
        "info": "只有已回覆的使用者可在分享到期後繼續查看捐贈資訊。"
        "select_package": "你必須選擇至少1個項目以分享捐贈。"
        "delete_sharing_link": "刪除分享連結"

      "donor":
        "offer_id": "捐贈項目號碼"
        "district": "地區"
        "registered": "已註冊"
        "last_seen": "最後上線"
        "total_offers": "捐贈總數"
        "crm": "CRM"
        "other_offers": "所有好人好市捐贈"
        "internet_call": "網上通話"
        "end_call": "結束通話"
        "active_call": "即時通話"

      "options":
        "reopen_offer": "Reopen"
        "resume_resuming_offer": "繼續接收"
        "add_item": "添加項目"
        "delete_offer": "刪除捐贈項目"
        "submit_offer": "重新提交捐贈項目"
        "merge_offer": "合拼捐贈項目"
        "yes": "Yes"

    "mark_received":
      "delivered_by": "運送人員："
      "gogovan": "Gogovan"
      "crossroads_truck": "十字路會貨車"
      "dropped_off": "親自運送"
      "unknown": "未知"

    "logistics":
      "no_items": "沒有需要運送的物品"
      "offer_closed": "此項捐贈已經關閉"
      "close_offer": "關閉捐獻贈項目"
      "message_donor": "向捐贈者發送信息"
      "finish_review_request": "請先完成審查！"
      "accepted_items": "已接受物品"
      "gogovan_requirement": "要求GoGoVan運送"
      "crossroads_requirement": "要求十字路會運送"
      "complete_review": "完成審查"
      "ggv_hire": "要求租用GoGoVan"
      "portion_for_crossroads_truck": "這項捐贈預計需佔用十字路會貨車多少空間？"
      "goods_received" : "物資接收日期"
      "arrange_transport": "安排運輸"
      "van": "小型貨車"
      "receiving" : "正在接收這項捐贈"
      "offer_cancelled_by": "這項捐贈由 {{lastName}} {{firstName}} 取消"
      "choose_ggv_option": "選擇GoGoVan租賃服務"
      "finished_review": "完成審查了嗎？"
      "add_message_to_donor": "聯絡捐贈者："

    "review_item":
      "title" : "審查物資"
      "accept" : "接受"
      "save_item": "儲存"
      "accept_item" : "儲存及接受"
      "reject" : "不接受"
      "reject_item" : "拒絕物品"
      "not_now" : "暫不決定"
      "donor_message" : "捐贈者訊息"
      "supervisor_message" : "監察員訊息"
      "view_lable_guide": "檢閱決定準則"
      "condition": "狀況"
      "add_component": "增加配件"
      "add_item_label": "增加物品類別"
      "assign": "指派"
      "select_package_image": "請選擇此項目最合適的相片:"

    "reject":
      "select_type": "請先選取物資類型！"
      "option_error": "請選擇原因"
      "reject_item": "拒絕物品"
      "quality" : "質量"
      "size": "大小"
      "supply": "供應/需求"
      "message_placeholder" : "發送信息予捐贈者，告知物品不被接受"
      "reject_message" : "很抱歉，我們不能接受這項物品。"
      "quality_message" : "對於部份物資類型，除非物資質量極佳，否則我們無法接收。"
      "size_message" : "很抱歉，由於物資過大，我們很困難找到可以安置物資的接受者。"
      "supply_message" : "很抱歉，由於我們已經有很多同類型的物資，我們無法接受您的捐贈。"
      "cancel_gogovan_confirm": "拒絕接受最後一項物資將會取消GoGoVan的預約，您是否確認？"
      "custom_reason": "特別原因"
      "cannot_reject_error": "已確認預約GoGoVan，因此無法拒絕最後一項物資。"

    "cancel_gogovan":
      "title": "取消預約GoGoVan"
      "once_confirmed": "GoGoVan確認預約取消後，您便能夠前往拒絕或取消此項捐贈。"
      "call_driver": "請致電GoGoVan以取消預約"
      "notify_donor": "聯絡捐贈者，告知預約已被取消"

    "receive":
      "unplanned_inventory": "新增未預期接收的項目到庫存"
      "missing": "遺失"
      "receive": "接收"
      "inventory": "存貨"
      "label": "類別"
      "resubmit": "若你接受此項目，請重新提交及審查物資。"
      "receiving":
        "header": "開始接收捐贈項目"
        "cant_modify_note": "提示：一旦捐贈項目狀態改成「正在接收」，將無法還原，捐贈人士亦無法更改物資資料。"
        "not_now": "現在無法進行"
        "begin_receiving": "開始接收",
      "inventorize_warning": "你確定要新增庫存嗎？"


    "finished":
      "title": "已完成"
      "received": "已接收"
      "cancelled": "已取消"
      "inactive": "暫停"

    "scheduled":
      "title": "已安排時間"
      "other_delivery": "其他運輸"
      "collection" : "收集"
      "gogovan" : "GoGoVan"
      "all_offers": "所有捐贈項目"
      "overdue": "過期"
      "today": "今天"
      "next_week": "下星期"
      "after_next_week": "下星期後"

    "placeholder":
      "qty": "數量"
      "height": "高度"
      "width": "闊度"
      "length": "長度"
      "package_type": "包裝類型"
      "comments": "描述"

    "receive_package":
      "inventory": "存貨號碼"
      "invalid_inventory": "存貨號碼不正確"
      "invalid_quantity": "空格不能留空"
      "invalid_description": "空格不能留空"
      "invalid_location": "抱歉，你必須輸入地址！"
      "receive": "接收"
      "cancel": "取消"
      "enter_barcode": "輸入條碼"
      "scan_barcode": "掃描條碼"
      "add_location": "加入地點"
      "grade_a": "等級: A"
      "grade_b": "等級: B"
      "grade_c": "等級: C"
      "grade_d": "等級: D"

    "user":
      "permission": "准許"

    "inactive_offer":
      "message": "此捐贈項目被暫停，可以隨意更改、重新提交或取消。"
      "add_message": "向捐贈人士傳送信息"
      "mark_inactive": "將狀態改成暫停"

    "cancel_offer":
      "donor_message": "選擇捐贈人士取消的原因"
      "cancel": "取消捐獻贈"

    "customized_variables":
      "click_here": "點擊這裏"

    "donor_details":
      "all_offers": "好人好市上的所有選擇"
      "company":
        "title": "企業捐助者"
        "remove": "去除企業捐助者"
        "assign": "指定另一間公司"
        "edit": "編輯這間公司"
        "add": "不適用，個人資料-補加公司資料"
        "new_company": "新公司"
        "edit_company": "編輯公司"
        "company_name": "公司名稱"
        "company_name_validation": "輸入有效的名稱"
        "crm_id": "CRM編號"
        "enter_crm_id": "輸入數值"
        "optional": "(可選填)"
        "enter_name": "輸入公司名稱"
      "contact":
        "title": "捐助者聯絡資料"
        "remove": "去除捐助者聯絡資料"
        "assign": "指定另一個捐助者"
        "add": "遺漏-補加聯絡資料"
      "mobile":
        "title": "捐助者電話號碼"
        "call_using_phone": "致電捐助者"
      "email":
        "title": "捐助者電郵地址"
      "alt_phone":
        "title": "捐助者其他電話號碼"
        "call_using_phone": "致電捐助者"
      "location":
        "title": "捐助者位置"
      "sale_allowed":
        "title": "可供銷售"
        "yes": "是"
        "no": "否"

    "offer_creation":
      "search_users":
        "find_donor": "找已有捐助者或"
        "create_donor": "建立新捐助者"
      "search_companies":
        "find_company": "找已有公司"
        "create_company": "建立新公司"
      "create_donor":
        "page_title": "新捐助者"
        "title": "標題"
        "first": "名字"
        "last": "姓氏"
        "mobile": "電話號碼"
        "email": "電郵地址"
        "other_phone": "其他電話號碼"
        "consent": "同意接收本會寄出的電子郵件"
        "default_location": "捐助者的設定位置"
        "select_district": "選擇區域"
        "errors":
          "title": "標題不能漏空"
          "first_name": "名字不能漏空"
          "last_name": "姓氏不能漏空"
          "cell_phone": "電話號碼不能漏空"

    "canned_response":
      "title": "管理預設訊息"
      "en_content": "英文內容不可留空"
      "en_label": "英文標籤不可留空"
      "delete_message": "刪除訊息"
      "label": "標籤"
      "message": "訊息"
      "back": "返回"
      "message_admin": "訊息管理"
      "canned_message": "預設訊息"
      "system_message": "系統訊息"
      "add_message": "新增訊息"
      "create_message": "創建訊息"
      "edit_message": "編輯訊息"
      "done": "完成"

`export default I18nTranslationsZhTw`
