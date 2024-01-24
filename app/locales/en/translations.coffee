`import Ember from "ember"`
`import SharedTranslationsEn from "shared-goodcity/locales/en/translations"`

I18nTranslationsEn =
  Ember.$.extend true, SharedTranslationsEn,
    "socket_offline_error": "Attempting to reconnect..."
    "reviewing": "Reviewing"
    "reviewed": "Reviewed"
    "submitted": "Submitted"
    "messages_title" : "Messages"
    "select": "Select"
    "cancel": "Cancel"
    "QuotaExceededError": "Site may not work in Safari's <b>private mode.</b> Please try</br><ul><li><a href='https://itunes.apple.com/in/app/goodcityadmin.hk/id1013288708?mt=8' style='color: black!important; background-color: #dee4eb !important;'>Downloading the iOS App</a></li><li>Using regular (not private) mode in Safari</li><li>Using Chrome's private browsing mode</li></ul>"
    "search_item_label": "Search item label"
    "designated_dispatched_error": "You cannot edit designated/dispatched items."
    "notes_en": "Notes EN"
    "notes_zh": "Notes 中文"
    "not_now" : "Not Now"
    "save_changes": "Save Changes"
    "search":
      "no_results": "Sorry, No results found."
      "server_search": "Find more on server"
      "placeholder": "Search"

    "inventory_options":
      "auto": "Auto Id"
      "input": "Input Id"
      "scan": "Scan Id"

    "users":
      "search": "Search User"
      "title": "Title"
      "first_name": "First Name"
      "last_name": "Last Name"
      "mobile": "Mobile"

    "camera_scan":
      "permission_error": "Camera permission is not turned on."

    "holiday":
      "name": "Holiday Name"
      "date": "Date"
      "add": "Add"
      "manage": "Manage Holidays"
      "description": "Donors will not be able to book a delivery or drop-off on the 'holiday' dates listed below."
      "delete_confirm": "Are you sure you wish to delete this holiday?"

    "my_account":
      "nav_title": "Manage my account"
      "title": "Manage My Account"
      "delete_title": "Delete My Account"
      "delete_account": "Delete my account"

    "delete_account":
      "title": "Delete My Account"

    "chats":
      "no_recipient": "Missing recipient. This chat is disabled"

    "offer":
      "title": "Offer"
      "donor": "Details"
      "transport": "Transport"
      "details" : "Offer details"
      "donor_messages" : "Donor Messages"
      "supervisor_messages" : "Supervisors Messages"
      "empty_msg" : "Sorry! This offer is empty."

      "merge":
        "title": "Select offer to merge with"
        "message": "Merging offers cannot be undone. All data will be retained except general discussion messages on the offer you just selected."
        "cancel": "Cancel"
        "merge": "Merge"
        "error": "These offers can not be merged."

      "offer_details" :
        "heading" : "Offer Details"
        "is_collection": "Collection"
        "is_drop_off": "Drop-off"
        "is_gogovan_order": "Van ordered"
        "is_gogovan_confirm": "Van confirmed"
        "driver_completed": "Driver completed"
        "offer_messages": "General Messages"
        "accepted": "Accepted"
        "not_needed": "Not needed"
        "closed_offer_message": "Offer closed. No items needed, Sorry."
        "received": "Received"
        "rejected": "rejected"
        "pending": "pending"
        "missing": "missing"
        "submitted": "submitted"
        "start_receiving_by": "{{firstName}} {{lastName}} began receiving"
        "inactive": "Marked as inactive"
    offer_sorts:
      sort_by: "Sort By",
      due_date: "Due date"
      create_date: "Created date"
      oldest: "Oldest"
      newest: "Newest"
    offer_filters:
      time_presets:
        overdue: "Overdue",
        today: "Today",
        tomorrow: "Tomorrow",
        week: "This week",
        next_week: "Next week",
        month: "This month",
        next_month: "Next month"

      show_priority_offers: "Only Show ..."
      offer_statuses: "Offer Statuses"
      on_or_after: "On or after"
      on_or_before: "On or before"
      apply: "Apply"
      clear: "Clear"
      back: "Back"
      self_review: "Mine"
      all_review: "All"
      time_filter_title: "Offer Due Date"
      button_state: "State"
      button_due: "Due"
      priorityOffers: "Priority Offers"
      priorityOffers_info: "Have remained in a state too long. Need attention."
      nonExpiredPublishedOffers: "Shared Offers"
      allPublishedOffers: "Include expired shares"
      submitted: "New"
      submitted_info: "Offers that have yet to be reviewed."
      under_review: "Reviewing"
      under_review_info: "Offers currently being reviewed."
      reviewed: "Reviewed"
      reviewed_info: "Offers that need to be scheduled."
      scheduled: "Scheduled"
      scheduled_info: "GoodCity order being dispatctched now."
      receiving: "Receiving"
      receiving_info: "We are unloading truck right now"
      received: "Received"
      received_info: "Success"
      cancelled: "Cancelled"
      cancelled_info: "Failed"
      inactive: "Inactive"
      inactive_info: "Donor non-responsive"

    "items":
      "title": "Receive-{{packageName}}"
      "remove_item":
        "confirmation_message": "Are you sure you want to cancel this item?"
        "yes": "Yes"
        "no": "No"
      "add_item":
        "description_placeholder" : "What is it? How many items? What's the size?"
        "quantity": "Quantity"
        "type": "Type"
        "add_images": "Add Images"
        "description": "Description"
        "quality": "Quality"
        "location": "Locations"
        "size": "Size(cm)"
        "labels": "Labels"
        "inventory": "Inventory"
        "publish": "Publish"
        "receive": "Receive"
        "print": "& Print {{labels}}"
        "printer": "Printer"
      "validation":
        "dimensions": "Provide all three dimensions(or none)"
        "quantity": "Quantity cannot be blank or 0."
        "labels": "Can't be blank."
        "max_lable_count": "Max 300"
        "description": "Description cannot be blank."
        "inventory_number": "Inventory Number cannot be blank."


    "item":
      "accepted": "Accepted"
      "multiple_designation": "designated"
      "all_dispatched": "Out of stock"
      "submitted_status": "This item is awaiting review."
      "in_review_status": "This item is being reviewed."
      "accepted_status": "This item has been accepted."
      "rejected_status": "This item has been rejected."
      "cancelled_status": "The offer this item belongs to has been cancelled by {{firstName}} {{lastName}} on"

      "messages":
        "info_text1": "If we have questions when reviewing this item we will chat with you here."
        "info_text2": "If you want to add a comment to this item for our reviewers, type it below."

    "dashboard":
      "title": "Dashboard",
      "all_active_offers": "All Active Offers"
      "my_active_offers": "My Active Offers",
      "under_review": "Reviewing",
      "reviewed": "Reviewed",
      "scheduled": "Scheduled",
      "receiving": "Receiving",
      "inactive": "Inactive",
      "cancelled": "Cancelled",
      "received": "Received",
      "new_offers": "New Offers",
      "shared_offers": "Shared Offers",
      "view_all_offers": "View all new offers"

    "inbox":
      "quick_links": "Quick Links"
      "all_offers": "All Offers"
      "create_offer": "Create offer"
      "notifications": "Notifications"
      "new_offers": "New"
      "new_items" : "New Items"
      "scheduled_offers": "Scheduled"
      "in_review" : "In Progress"
      "my_list" : "My List"
      "finished": "Finished"
      "closed_offers": "Finished"
      "receiving": "Receiving"
      "users": "Users"
      "holidays": "Holidays"
      "search_offer_message": "Only recently updated offers are shown. Use search to find older offers."

    "my_notifications":
      "heading" : "{{name}}'s Offer"
      "all_notifications" : "Show all notifications"
      "show_unread" : "Show unread only"
      "mark_all_read" : "Mark all read"
      "no_unread": "No unread messages!"

    "review_offer":
      "title" : "Review Offer"
      "review_started_by" : "Started by {{firstName}} {{lastName}}"
      "no_items": "No items needed"
      "close_offer": "Close Offer"
      "items_reviewed": "All items reviewed"
      "set_logistics": "Set logistics"
      "to_complete": "to complete"
      "plan_transport": "User to plan transport."
      "reviewed": "Reviewed"
      "start_review": "Start Review"
      "goods_received_by" : "Goods donated by {{firstName}} {{lastName}} received"
      "goods_start_receiving_by": "{{firstName}} {{lastName}} began receiving items"
      "offer_closed_by": "Offer closed by {{firstName}} {{lastName}}"
      "offer_cancelled_by": "Cancelled by {{firstName}} {{lastName}}"
      "receive": "Receive"
      "view_shared_offer": "View Share"
      "share_expired": "Share Expired"
      "modify_sharing": "Modify Sharing"
      "share_offer": "Share offer"
      "sale_allowed": "Sale of these items is allowed"
      "sale_not_allowed": "Sale of these items is not allowed"
      "sharing_notes_default": "Interested parties should indicate the quantity and timing of their interest"
      "offer_instructions_en": "Offer Instructions EN"
      "offer_instructions_zh": "Offer Instructions 中文"
      "offer_instructions_details": "These will be visible to external viewers"
      "share_offer_explanation": "Make it possible for registered charities to see and indicate interest in this offer"
      "private_sharing_mode_desc": "Do not share"
      "public_sharing_mode_desc": "Share via URL"
      "public_listed_sharing_mode_desc": "Share via URL + Website listing"
      "items_to_share": "Items to share"
      "cannot_share_offer_without_packages": "An offer with no created packages cannot be shared"
      "select_all": "Select all"
      "missing": "Missing"
      "received": "Received"
      "expecting": "Expecting"
      "all_items_processed": "All items marked received or missing."
      "inactive_offer": "This offer is marked as inactive."
      "message_donor": "Send message to donor about closing offer:"
      "confirm_receiving_message": "Receiving items after an offer has been finished will change the state of the offer to 'Receiving'. Are you sure you want to receive the item(s)?"
      "close_offer_summary": "This will close the offer."
      "add_note": "Tap to add/edit sticky note"
      "tap_to_save": "tap to save"
      "empty_offer_message": "This offer is empty. Do you want to delete it?"
      "update_offer_sharing": "Update Offer Sharing"
      "include_in_listing": "Include in listing"
      "share_offer_until": "Share offer until"
      "set_expiry_to_now": "Set expiry to now"

      "share":
        "title": "Share"
        "info": "Only users who have already responded will be able to see information about this offer after the share expires."
        "select_package": "You must select at least one item to share the offer."
        "delete_sharing_link": "Delete sharing link"

      "donor":
        "offer_id": "Offer ID"
        "district": "District"
        "registered": "Registered"
        "last_seen": "Last seen"
        "total_offers": "Total offers"
        "crm": "CRM"
        "other_offers": "All offers on GoodCity"
        "internet_call": "Internet Call"
        "end_call": "End Call"
        "active_call": "Active Call"

      "options":
        "reopen_offer": "Reopen"
        "resume_resuming_offer": "Resume receiving"
        "add_item": "Add an item"
        "delete_offer": "Delete Offer"
        "submit_offer": "Re-submit Offer"
        "merge_offer": "Merge Offer"
        "yes": "Yes"

    "mark_received":
      "delivered_by": "Delivered by:"
      "gogovan": "Gogovan"
      "crossroads_truck": "Crossroads truck"
      "dropped_off": "Dropped off"
      "unknown": "Unknown"

    "logistics":
      "no_items": "No items to transport."
      "offer_closed": "This offer is closed now."
      "close_offer": "Close Offer"
      "message_donor": "Message Donor"
      "finish_review_request": "Please finish reviewing items first!"
      "accepted_items": "Accepted Items"
      "gogovan_requirement": "Gogovan Requirement"
      "crossroads_requirement": "Crossroads Requirement"
      "complete_review": "Complete Review"
      "ggv_hire": "Gogovan Hire Requirement"
      "portion_for_crossroads_truck": "What portion of the Crossroads truck will this offer take up?"
      "goods_received" : "Goods received on"
      "arrange_transport": "Arrange Transport"
      "van": "Van"
      "receiving" : "This offer is currently being received."
      "offer_cancelled_by": "Offer cancelled by {{firstName}} {{lastName}}"
      "choose_ggv_option": "Choose GoGoVan hire requirement"
      "finished_review": "Finished reviewing this offer?"
      "add_message_to_donor": "Message to the donor:"

    "review_item":
      "title" : "Review Item"
      "accept" : "Accept"
      "save_item": "Save Only"
      "accept_item" : "Save + Accept"
      "reject" : "Reject"
      "reject_item" : "reject Item"
      "not_now" : "Not Now"
      "donor_message" : "Donor"
      "supervisor_message" : "Supervisors"
      "view_lable_guide": "View labeling guide"
      "condition": "Condition"
      "add_component": "Add component"
      "add_item_label": "Add item label"
      "assign": "Assign"
      "select_package_image": "Choose the favourite image for this package:"


    "reject":
      "select_type": "Please choose Item Type first!"
      "option_error": "Please choose a reason."
      "reject_item": "Reject Item"
      "quality" : "Quality"
      "size": "Size"
      "supply": "Supply/Demand"
      "message_placeholder" : "Message to donor about the rejection of this item"
      "reject_message" : "Unfortunately we cannot receive this item. "
      "quality_message" : "Some categories of items are very difficult for us to distribute unless they are in excellent condition."
      "size_message" : "Very few of our clients are able to accommodate large items in their homes."
      "supply_message" : "Unfortunately we cannot receive this item because we have a large quantity already in stock."
      "cancel_gogovan_confirm": "Rejecting the last item will cancel the gogovan booking, do you wish to proceed?"
      "custom_reason": "Custom Reason"
      "cannot_reject_error": "Cannot reject last item if there's a confirmed GoGoVan booking."

    "cancel_gogovan":
      "title": "Cancel GoGoVan Booking"
      "once_confirmed": "Once GoGoVan confirms the booking is cancelled you will be able to proceed rejecting or cancelling the offer."
      "call_driver": "Please cancel the GoGoVan booking by calling GoGoVan on"
      "notify_donor": "Message the donor to let them know their GoGoVan booking is being cancelled"

    "receive":
      "unplanned_inventory": "Add unplanned item to inventory"
      "missing": "Missing"
      "receive": "Receive"
      "inventory": "Inventory"
      "label": "Label"
      "resubmit": "To receive this offer, please re-submit and review the offer."
      "receiving":
        "header": "Begin Receiving Offer"
        "cant_modify_note": "Note: Putting an offer in the \"receiving\" state cannot be undone. Donors cannot modify their offer once you start receiving the items."
        "not_now": "Not Now"
        "begin_receiving": "Begin Receiving"

      "inventorize_warning": "Are you sure you want to inventorize?"

    "finished":
      "title": "Finished"
      "received": "Received"
      "cancelled": "Cancelled"
      "inactive": "Inactive"

    "scheduled":
      "title": "Scheduled"
      "other_delivery": "Other Delivery"
      "collection" : "Collection"
      "gogovan" : "GoGoVan"
      "all_offers": "All offers"
      "overdue": "Overdue"
      "today": "Today"
      "next_week": "Next week"
      "after_next_week": "After next week"

    "placeholder":
      "qty": "Qty"
      "height": "H"
      "width": "W"
      "length": "L"
      "package_type": "Package Type"
      "comments": "Description"

    "receive_package":
      "inventory": "Print will generate number"
      "invalid_inventory": "Inventory number is invalid."
      "invalid_quantity": "Quantity can not be blank."
      "invalid_description": "Description can not be blank."
      "invalid_location": "Location can not be blank."
      "receive": "Receive"
      "cancel": "Cancel"
      "scan_barcode": "Scan barcode"
      "enter_barcode": "Enter barcode"
      "add_location": "Add Location"
      "grade_a": "Grade: A"
      "grade_b": "Grade: B"
      "grade_c": "Grade: C"
      "grade_d": "Grade: D"

    "user":
      "permission": "Permission"

    "inactive_offer":
      "message": "This offer seems to be inactive. Please feel free to modify, re-submit or cancel it."
      "add_message": "Add message for donor"
      "mark_inactive": "Mark Inactive"

    "cancel_offer":
      "donor_message": "Choose why the donor wishes to cancel this offer."
      "cancel": "Cancel Offer"

    "customized_variables":
      "click_here": "click here"

    "donor_details":
      "all_offers": "'s all offers on GoodCity:"
      "company":
        "title": "Corporate Donor:"
        "remove": "Remove corporate donor"
        "assign": "Assign different company"
        "edit": "Edit this company"
        "add": "NA, Personal - Add company"
        "new_company": "New Company"
        "edit_company": "Edit Company"
        "company_name": "Company Name"
        "company_name_validation": "Enter valid name"
        "crm_id": "CRM ID"
        "enter_crm_id": "Enter numeric values"
        "optional": "(Optional)"
        "enter_name": "Enter Company Name"
      "contact":
        "title": "Donor Contact:"
        "remove": "Remove donor contact"
        "assign": "Assign different donor"
        "add": "Missing - Add contact"
      "mobile":
        "title": "Donor mobile:"
        "call_using_phone": "Call donor using phone"
      "email":
        "title": "Donor email:"
      "alt_phone":
        "title": "Donor alt phone:"
        "call_using_phone": "Call donor using phone"
      "location":
        "title": "Donors location:"
        "offer": "Offer's location:"
      "sale_allowed":
        "title": "Sale allowed"
        "yes": "Yes"
        "no": "No"

    "offer_creation":
      "search_users":
        "find_donor": "Find existing donor or"
        "create_donor": "Create A New Donor"
      "search_companies":
        "find_company": "Find existing company or"
        "create_company": "Create new company"
      "create_donor":
        "page_title": "New Donor"
        "title": "Title"
        "first": "First Name"
        "last": "Last Name"
        "mobile": "Mobile Number"
        "email": "Email Address"
        "other_phone": "Other Phone"
        "consent": "Has given consent to receive emails from us."
        "default_location": "Donor's Default Location"
        "select_district": "Select a District"
        "errors":
          "title": "Title can't be blank"
          "first_name": "First name can't be blank"
          "last_name": "Last name can't be blank"
          "cell_phone": "Mobile number can't be blank"

    "canned_response":
      "title": "Manage pro-forma messages"
      "en_content": "English content cannot be blank"
      "en_label": "English label cannot be blank"
      "delete_message": "Delete Message"
      "label": "Label"
      "message": "Message"
      "back": "Back"
      "message_admin": "Message Admin"
      "canned_message": "Canned Message"
      "system_message": "System Message"
      "add_message": "Add Message"
      "create_message": "Create Message"
      "edit_message": "Edit Message"
      "done": "Done"

`export default I18nTranslationsEn`
