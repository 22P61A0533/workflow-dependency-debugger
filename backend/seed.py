from neo4j import Session

from backend.database import driver


def create_constraints(session: Session):
    constraints = [
        """
        CREATE CONSTRAINT automation_id IF NOT EXISTS
        FOR (a:Automation) REQUIRE a.id IS UNIQUE
        """,
        """
        CREATE CONSTRAINT trigger_id IF NOT EXISTS
        FOR (t:Trigger) REQUIRE t.id IS UNIQUE
        """,
        """
        CREATE CONSTRAINT action_id IF NOT EXISTS
        FOR (a:Action) REQUIRE a.id IS UNIQUE
        """,
        """
        CREATE CONSTRAINT tool_id IF NOT EXISTS
        FOR (t:Tool) REQUIRE t.id IS UNIQUE
        """,
        """
        CREATE CONSTRAINT datafield_id IF NOT EXISTS
        FOR (d:DataField) REQUIRE d.id IS UNIQUE
        """,
    ]

    for query in constraints:
        session.run(query)


def create_tools(session: Session):
    tools = [
        ("slack", "Slack", "Communication"),
        ("salesforce", "Salesforce", "CRM"),
        ("gmail", "Gmail", "Email"),
        ("google_sheets", "Google Sheets", "Data"),
        ("hubspot", "HubSpot", "CRM"),
        ("stripe", "Stripe", "Payments"),
        ("zendesk", "Zendesk", "Customer Support"),
    ]

    session.run(
        """
        UNWIND $tools AS tool
        MERGE (t:Tool {id: tool.id})
        SET t.name = tool.name,
            t.category = tool.category
        """,
        tools=[
            {"id": tool_id, "name": name, "category": category}
            for tool_id, name, category in tools
        ],
    )


def create_data_fields(session: Session):
    fields = [
        ("customer_id", "Customer ID"),
        ("customer_name", "Customer Name"),
        ("customer_email", "Customer Email"),
        ("lead_id", "Lead ID"),
        ("lead_status", "Lead Status"),
        ("deal_id", "Deal ID"),
        ("deal_status", "Deal Status"),
        ("order_id", "Order ID"),
        ("order_status", "Order Status"),
        ("ticket_id", "Ticket ID"),
        ("ticket_status", "Ticket Status"),
        ("notification_status", "Notification Status"),
        ("onboarding_status", "Onboarding Status"),
    ]

    session.run(
        """
        UNWIND $fields AS field
        MERGE (d:DataField {id: field.id})
        SET d.name = field.name
        """,
        fields=[
            {"id": field_id, "name": name}
            for field_id, name in fields
        ],
    )


def create_automations(session: Session):
    automations = [
        {
            "id": "auto_create_lead",
            "name": "Create CRM Lead",
            "description": "Creates a CRM lead when a new qualified lead is received.",
        },
        {
            "id": "auto_update_lead",
            "name": "Update Lead Status",
            "description": "Updates the CRM lead status after sales activity.",
        },
        {
            "id": "auto_notify_sales",
            "name": "Notify Sales Team",
            "description": "Sends a Slack notification when an important lead status changes.",
        },
        {
            "id": "auto_customer_onboarding",
            "name": "Start Customer Onboarding",
            "description": "Creates onboarding tasks when a deal is won.",
        },
        {
            "id": "auto_process_order",
            "name": "Process New Order",
            "description": "Processes a new paid order and updates order status.",
        },
        {
            "id": "auto_order_sheet",
            "name": "Update Order Spreadsheet",
            "description": "Writes order information into the operations spreadsheet.",
        },
        {
            "id": "auto_order_email",
            "name": "Send Order Confirmation",
            "description": "Sends an order confirmation email to the customer.",
        },
        {
            "id": "auto_support_escalation",
            "name": "Escalate Support Ticket",
            "description": "Escalates high-priority unresolved support tickets.",
        },
        {
            "id": "auto_support_notify",
            "name": "Notify Support Manager",
            "description": "Notifies the support manager when a ticket is escalated.",
        },
    ]

    session.run(
        """
        UNWIND $automations AS item
        MERGE (a:Automation {id: item.id})
        SET a.name = item.name,
            a.description = item.description
        """,
        automations=automations,
    )


def create_triggers_and_actions(session: Session):
    triggers = [
        {
            "id": "trigger_new_lead",
            "name": "New Qualified Lead",
            "type": "event",
            "automation_id": "auto_create_lead",
        },
        {
            "id": "trigger_lead_change",
            "name": "Lead Status Changed",
            "type": "data_change",
            "automation_id": "auto_update_lead",
        },
        {
            "id": "trigger_sales_notification",
            "name": "Important Lead Status",
            "type": "data_change",
            "automation_id": "auto_notify_sales",
        },
        {
            "id": "trigger_deal_won",
            "name": "Deal Won",
            "type": "event",
            "automation_id": "auto_customer_onboarding",
        },
        {
            "id": "trigger_new_order",
            "name": "New Paid Order",
            "type": "event",
            "automation_id": "auto_process_order",
        },
        {
            "id": "trigger_order_change",
            "name": "Order Status Changed",
            "type": "data_change",
            "automation_id": "auto_order_sheet",
        },
        {
            "id": "trigger_order_confirmation",
            "name": "Order Ready",
            "type": "event",
            "automation_id": "auto_order_email",
        },
        {
            "id": "trigger_ticket_priority",
            "name": "High Priority Ticket",
            "type": "event",
            "automation_id": "auto_support_escalation",
        },
        {
            "id": "trigger_ticket_escalated",
            "name": "Ticket Escalated",
            "type": "event",
            "automation_id": "auto_support_notify",
        },
    ]

    session.run(
        """
        UNWIND $triggers AS item
        MERGE (t:Trigger {id: item.id})
        SET t.name = item.name,
            t.type = item.type
        WITH t, item
        MATCH (a:Automation {id: item.automation_id})
        MERGE (t)-[:STARTS]->(a)
        """,
        triggers=triggers,
    )

    actions = [
        {
            "id": "action_create_lead",
            "name": "Create Salesforce Lead",
            "automation_id": "auto_create_lead",
            "tool_id": "salesforce",
            "reads": ["customer_name", "customer_email"],
            "writes": ["lead_id", "lead_status"],
        },
        {
            "id": "action_update_lead",
            "name": "Update Salesforce Lead",
            "automation_id": "auto_update_lead",
            "tool_id": "salesforce",
            "reads": ["lead_id", "lead_status"],
            "writes": ["lead_status"],
        },
        {
            "id": "action_notify_sales",
            "name": "Send Slack Sales Notification",
            "automation_id": "auto_notify_sales",
            "tool_id": "slack",
            "reads": ["lead_id", "lead_status"],
            "writes": ["notification_status"],
        },
        {
            "id": "action_start_onboarding",
            "name": "Create Onboarding Task",
            "automation_id": "auto_customer_onboarding",
            "tool_id": "hubspot",
            "reads": ["deal_id", "deal_status", "customer_email"],
            "writes": ["onboarding_status"],
        },
        {
            "id": "action_process_order",
            "name": "Process Stripe Order",
            "automation_id": "auto_process_order",
            "tool_id": "stripe",
            "reads": ["order_id"],
            "writes": ["order_status"],
        },
        {
            "id": "action_update_order_sheet",
            "name": "Update Operations Sheet",
            "automation_id": "auto_order_sheet",
            "tool_id": "google_sheets",
            "reads": ["order_id", "order_status"],
            "writes": ["order_status"],
        },
        {
            "id": "action_order_email",
            "name": "Send Order Confirmation",
            "automation_id": "auto_order_email",
            "tool_id": "gmail",
            "reads": ["customer_email", "order_id", "order_status"],
            "writes": ["notification_status"],
        },
        {
            "id": "action_escalate_ticket",
            "name": "Escalate Zendesk Ticket",
            "automation_id": "auto_support_escalation",
            "tool_id": "zendesk",
            "reads": ["ticket_id", "ticket_status"],
            "writes": ["ticket_status"],
        },
        {
            "id": "action_notify_manager",
            "name": "Notify Support Manager",
            "automation_id": "auto_support_notify",
            "tool_id": "slack",
            "reads": ["ticket_id", "ticket_status"],
            "writes": ["notification_status"],
        },
    ]

    session.run(
        """
        UNWIND $actions AS item
        MERGE (action:Action {id: item.id})
        SET action.name = item.name

        WITH action, item
        MATCH (automation:Automation {id: item.automation_id})
        MERGE (automation)-[:HAS_ACTION]->(action)

        WITH action, item
        MATCH (tool:Tool {id: item.tool_id})
        MERGE (action)-[:USES_TOOL]->(tool)

        WITH action, item
        UNWIND item.reads AS field_id
        MATCH (field:DataField {id: field_id})
        MERGE (action)-[:READS]->(field)
        """,
        actions=actions,
    )

    session.run(
        """
        UNWIND $actions AS item
        MATCH (action:Action {id: item.id})
        UNWIND item.writes AS field_id
        MATCH (field:DataField {id: field_id})
        MERGE (action)-[:WRITES]->(field)
        """,
        actions=actions,
    )


def create_automation_dependencies(session: Session):
    dependencies = [
        ("auto_create_lead", "auto_update_lead", "Lead status produced by CRM creation"),
        ("auto_update_lead", "auto_notify_sales", "Sales notification depends on lead status"),
        ("auto_process_order", "auto_order_sheet", "Operations sheet depends on order status"),
        ("auto_order_sheet", "auto_order_email", "Customer notification depends on order status"),
        ("auto_support_escalation", "auto_support_notify", "Manager notification depends on escalation"),
    ]

    session.run(
        """
        UNWIND $dependencies AS dependency
        MATCH (source:Automation {id: dependency.source})
        MATCH (target:Automation {id: dependency.target})
        MERGE (source)-[r:DEPENDS_ON]->(target)
        SET r.reason = dependency.reason
        """,
        dependencies=[
            {
                "source": source,
                "target": target,
                "reason": reason,
            }
            for source, target, reason in dependencies
        ],
    )


def seed_database():
    with driver.session() as session:
        create_constraints(session)
        create_tools(session)
        create_data_fields(session)
        create_automations(session)
        create_triggers_and_actions(session)
        create_automation_dependencies(session)

    print("Seed data successfully loaded into CognoDB.")


if __name__ == "__main__":
    try:
        seed_database()
    finally:
        driver.close()