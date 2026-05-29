import { generateId } from '../utils/uuid'

const now = new Date()
const daysAgo = (d) => new Date(now - d * 86400000).toISOString()

export const SEED_DATA = {
  meta: {
    targetValue: 10.0,
    commentary: "Pipeline on track to exceed £10M target. Key focus: accelerate G3 Dynamic Pricing Engine through to G4 by Q3. Legacy ERP migration has banked £7.4M — learnings being applied to Supply Chain platform.",
    lastUpdated: now.toISOString()
  },
  initiatives: [
    {
      id: generateId(),
      title: "Procurement AI Optimisation",
      owner: "Sarah Chen",
      businessUnit: "Procurement",
      description: "Use AI to optimise procurement decisions, supplier selection and contract terms to reduce cost base.",
      stage: "G0",
      createdAt: daysAgo(3),
      updatedAt: daysAgo(1),
      valueEstimates: { G0: 2.0 },
      stageData: {
        G0: {
          problemStatement: "Manual procurement processes lead to suboptimal supplier selection and missed volume discounts worth an estimated £2M annually.",
          hypothesis: "AI-driven analysis of spend data and supplier performance can identify £2M+ in savings through better negotiations and consolidation.",
          sponsor: "James Whitfield, CPO",
          dataAvailable: "Yes – 3 years of spend data in ERP, supplier master data available"
        }
      },
      history: [
        { id: generateId(), type: "stage_submission", fromStage: null, toStage: "G0", decision: null, comment: "Initiative logged and assigned to Sarah Chen.", actionsRequired: [], decidedBy: "System", decidedAt: daysAgo(3) }
      ],
      documents: [],
      tags: ["AI", "Cost Reduction", "Procurement"]
    },
    {
      id: generateId(),
      title: "Digital Customer Onboarding",
      owner: "Marcus Reid",
      businessUnit: "Operations",
      description: "Replace manual customer onboarding process with digital self-service portal, reducing time-to-active from 14 days to 2 days.",
      stage: "G1",
      createdAt: daysAgo(30),
      updatedAt: daysAgo(5),
      valueEstimates: { G0: 3.0, G1: 4.5 },
      stageData: {
        G0: {
          problemStatement: "Customer onboarding takes 14 days and requires 6 manual touchpoints, causing 23% churn before activation.",
          hypothesis: "Digital self-service can reduce onboarding to 2 days and cut churn to under 10%.",
          sponsor: "Helen Park, COO",
          dataAvailable: "Partial – CRM data available, but document verification process needs new tooling"
        },
        G1: {
          businessProblem: "Current manual process costs £1.2M/yr in operations headcount and loses ~£3.3M/yr in customers who abandon during onboarding.",
          workflow: "Customer submits docs → Ops team manually verifies → System setup → Welcome call → Account active",
          hypothesis: "Digital portal with automated ID verification and instant system provisioning eliminates manual steps.",
          tshirtCostSize: "M",
          tshirtValueSize: "L",
          technicalFeasibility: "High – integration APIs exist for all core systems",
          dataFeasibility: "Medium – ID verification requires third-party API integration",
          peopleImpact: "3 FTE redeployment from Ops team required",
          riskAssessment: "Regulatory compliance for digital ID verification is key risk – legal review underway"
        }
      },
      history: [
        { id: generateId(), type: "stage_submission", fromStage: null, toStage: "G0", decision: null, comment: "Idea submitted.", actionsRequired: [], decidedBy: "System", decidedAt: daysAgo(30) },
        { id: generateId(), type: "gate_decision", fromStage: "G0", toStage: "G1", decision: "approved", comment: "Strong hypothesis and clear owner. Value estimate credible. Advance to G1 for fuller scoping.", actionsRequired: ["Complete legal review of digital ID verification", "Quantify churn impact with Finance"], decidedBy: "Gate Reviewer", decidedAt: daysAgo(20) },
        { id: generateId(), type: "stage_submission", fromStage: "G0", toStage: "G1", decision: null, comment: "G1 data submitted for gate review.", actionsRequired: [], decidedBy: "Marcus Reid", decidedAt: daysAgo(5) }
      ],
      documents: [],
      tags: ["Digital", "Customer Experience", "Automation"]
    },
    {
      id: generateId(),
      title: "Supply Chain Visibility Platform",
      owner: "Priya Sharma",
      businessUnit: "Logistics",
      description: "Real-time supply chain visibility platform integrating all supplier, logistics and warehouse data to reduce inventory costs and improve service levels.",
      stage: "G2",
      createdAt: daysAgo(75),
      updatedAt: daysAgo(8),
      valueEstimates: { G0: 4.0, G1: 5.5, G2: 6.0 },
      stageData: {
        G0: { problemStatement: "No end-to-end visibility of supply chain leading to excess inventory and poor service levels.", hypothesis: "Real-time visibility platform will cut inventory by 20% and improve OTIF by 15pp.", sponsor: "David Kwan, CIO", dataAvailable: "Yes" },
        G1: { businessProblem: "£8M excess inventory and 73% OTIF vs 88% industry benchmark.", workflow: "Orders → Supplier → 3PL → DC → Store with no real-time tracking at any stage", hypothesis: "Integrated data platform enables proactive intervention to prevent failures.", tshirtCostSize: "L", tshirtValueSize: "XL", technicalFeasibility: "Medium", dataFeasibility: "Medium", peopleImpact: "Logistics planning team upskilling required", riskAssessment: "Data sharing agreements with 3PL partners needed" },
        G2: {
          mvpScope: "Phase 1: Real-time tracking for top 20 suppliers and 2 DCs. Phase 2: Extend to all suppliers.",
          userStrategy: "Logistics planners as primary users. Mobile app for warehouse teams. Executive dashboard for leadership.",
          dataFeasibilityDetail: "EDI feeds from top 20 suppliers confirmed. 3PL API integration scoped and agreed.",
          dataReadinessPlan: "Data cleanse of supplier master data Q1. Integration build Q2.",
          technicalReadiness: "AWS infrastructure approved. Integration team resourced.",
          orgReadiness: "Change management plan drafted. 2 key logistics planner champions identified.",
          deliveryRoadmap: "Q1: Data foundation. Q2: Phase 1 live. Q3: Phase 2 rollout. Q4: Benefits realisation.",
          phaseBreakdown: "Phase 1 cost: £800K. Phase 2: £400K. Total investment: £1.2M over 12 months.",
          businessCaseNarrative: "NPV of £4.8M over 3 years. Payback in 8 months from Phase 1 go-live. Inventory reduction of £1.5M and OTIF improvement worth £4.5M in customer retention.",
          expertReviewNotes: "Finance validated NPV model. IT confirmed architecture. Legal cleared 3PL data sharing agreements."
        }
      },
      history: [
        { id: generateId(), type: "stage_submission", fromStage: null, toStage: "G0", decision: null, comment: "Idea submitted.", actionsRequired: [], decidedBy: "System", decidedAt: daysAgo(75) },
        { id: generateId(), type: "gate_decision", fromStage: "G0", toStage: "G1", decision: "approved", comment: "Credible opportunity with strong strategic fit. Value estimate needs validation with Finance.", actionsRequired: ["Finance validation of inventory numbers", "3PL data sharing feasibility check"], decidedBy: "Gate Reviewer", decidedAt: daysAgo(60) },
        { id: generateId(), type: "gate_decision", fromStage: "G1", toStage: "G2", decision: "approved", comment: "Excellent G1 submission. Business case solid. Advance to MVP definition with full expert input.", actionsRequired: ["Legal sign-off on 3PL agreements before G2 gate", "Confirm IT resource availability"], decidedBy: "Gate Reviewer", decidedAt: daysAgo(40) },
        { id: generateId(), type: "stage_submission", fromStage: "G1", toStage: "G2", decision: null, comment: "G2 MVP definition complete. Submitted for gate review.", actionsRequired: [], decidedBy: "Priya Sharma", decidedAt: daysAgo(8) }
      ],
      documents: [],
      tags: ["Supply Chain", "Data Platform", "Cost Reduction"]
    },
    {
      id: generateId(),
      title: "Dynamic Pricing Engine",
      owner: "Tom Bradley",
      businessUnit: "Commercial",
      description: "ML-powered dynamic pricing engine to optimise product pricing in real-time based on demand, competitor pricing and inventory levels.",
      stage: "G3",
      createdAt: daysAgo(120),
      updatedAt: daysAgo(12),
      valueEstimates: { G0: 2.5, G1: 3.0, G2: 3.5, G3: 3.2 },
      stageData: {
        G0: { problemStatement: "Static pricing leaves value on table during peak demand and causes excess inventory at low demand periods.", hypothesis: "Dynamic pricing can improve gross margin by 2-3pp.", sponsor: "Anna Torres, CCO", dataAvailable: "Yes" },
        G1: { businessProblem: "Current margin 34% vs 37% industry best practice. Static weekly pricing cycle.", workflow: "Weekly pricing committee → Manual updates → POS", hypothesis: "Real-time ML pricing improves margin by 2pp = £3.2M on £160M revenue base.", tshirtCostSize: "L", tshirtValueSize: "L", technicalFeasibility: "High", dataFeasibility: "High", peopleImpact: "Pricing team role change from decision-makers to oversight", riskAssessment: "Customer perception risk – price volatility could damage trust" },
        G2: { mvpScope: "Phase 1: Dynamic pricing for top 100 SKUs in 5 categories.", userStrategy: "Pricing managers monitor and override. Daily reporting to CCO.", dataFeasibilityDetail: "POS data, competitor scraping, inventory feeds all available.", dataReadinessPlan: "Competitor data ingestion pipeline built in Q1.", technicalReadiness: "ML platform in place (existing data science team).", orgReadiness: "Pricing team trained on oversight tools.", deliveryRoadmap: "Q1: Model build. Q2: Shadow pricing. Q3: Live phase 1. Q4: Expand.", phaseBreakdown: "Total investment £650K. Phase 1 ROI in 4 months.", businessCaseNarrative: "£3.2M annual benefit from margin improvement. Low investment relative to return.", expertReviewNotes: "Finance signed off. Legal cleared on pricing regulations." },
        G3: {
          dataSourced: "POS data pipeline live. Competitor scraping API integrated. Inventory feed connected.",
          platformAccess: "AWS SageMaker ML platform. Python data science stack.",
          mvpDescription: "XGBoost pricing model trained on 24 months of transaction data. Real-time pricing API with 200ms response time. Override dashboard built for pricing team.",
          okrs: "OKR1: Margin improvement ≥1.5pp on Phase 1 SKUs by month 3. OKR2: <5% customer complaints about price changes. OKR3: 95% system uptime.",
          measurementFramework: "A/B test: 50 stores dynamic pricing vs 50 stores control. Weekly reporting cadence.",
          modelMonitoringStrategy: "Daily drift detection. Weekly model performance review. Automatic rollback if margin degrades >0.5pp.",
          userTestingFeedback: "Pricing team feedback: dashboard intuitive, override function works well. Request for mobile alerts added to backlog.",
          valueProofPoints: "Shadow pricing for 6 weeks showed +1.8pp margin vs control. Finance validated methodology."
        }
      },
      history: [
        { id: generateId(), type: "gate_decision", fromStage: "G0", toStage: "G1", decision: "approved", comment: "Strong commercial case.", actionsRequired: [], decidedBy: "Gate Reviewer", decidedAt: daysAgo(105) },
        { id: generateId(), type: "gate_decision", fromStage: "G1", toStage: "G2", decision: "approved", comment: "Solid G1. Customer perception risk mitigated by gradual rollout strategy.", actionsRequired: ["Customer comms strategy to be defined at G2"], decidedBy: "Gate Reviewer", decidedAt: daysAgo(80) },
        { id: generateId(), type: "gate_decision", fromStage: "G2", toStage: "G3", decision: "approved", comment: "Excellent business case. Shadow pricing data at G3 will confirm value.", actionsRequired: ["A/B test design to be locked in before build starts"], decidedBy: "Gate Reviewer", decidedAt: daysAgo(50) },
        { id: generateId(), type: "stage_submission", fromStage: "G2", toStage: "G3", decision: null, comment: "MVP built. Shadow pricing complete. Submitted for G3 gate.", actionsRequired: [], decidedBy: "Tom Bradley", decidedAt: daysAgo(12) }
      ],
      documents: [],
      tags: ["ML", "Pricing", "Revenue Growth"]
    },
    {
      id: generateId(),
      title: "Workforce Planning Analytics",
      owner: "Claire Fontaine",
      businessUnit: "HR",
      description: "Advanced analytics platform for workforce demand forecasting and capacity planning to reduce agency labour spend and improve scheduling efficiency.",
      stage: "G4",
      createdAt: daysAgo(200),
      updatedAt: daysAgo(15),
      valueEstimates: { G0: 1.5, G1: 2.0, G2: 1.9, G3: 1.8, G4: 1.8 },
      stageData: {
        G0: { problemStatement: "Reactive workforce planning leads to expensive agency labour and scheduling inefficiencies.", hypothesis: "Demand forecasting can reduce agency spend by 30%.", sponsor: "Robert Lee, CHRO", dataAvailable: "Yes" },
        G1: { businessProblem: "£6M agency labour spend, 30% of which is avoidable with better forecasting.", workflow: "Manual weekly scheduling based on manager estimates", hypothesis: "ML forecasting + optimised scheduling reduces agency dependency.", tshirtCostSize: "M", tshirtValueSize: "M", technicalFeasibility: "High", dataFeasibility: "High", peopleImpact: "HR planning team upskilling", riskAssessment: "Union consultation required for scheduling changes" },
        G2: { mvpScope: "Demand forecasting for 3 largest sites.", userStrategy: "Site managers primary users.", dataFeasibilityDetail: "HR system data clean and accessible.", dataReadinessPlan: "Historical scheduling data extraction complete.", technicalReadiness: "HR system APIs confirmed.", orgReadiness: "Union consultation complete – positive reception.", deliveryRoadmap: "Q1: Build. Q2: Pilot 3 sites. Q3: Full rollout. Q4: Benefits.", phaseBreakdown: "Total investment £400K.", businessCaseNarrative: "£1.8M annual saving from reduced agency labour.", expertReviewNotes: "Finance validated. HR legal confirmed compliance." },
        G3: { dataSourced: "Full HR data pipeline live.", platformAccess: "Azure ML platform.", mvpDescription: "Ensemble forecasting model. Scheduling optimisation algorithm. Manager dashboard.", okrs: "OKR1: 25% reduction in agency hours on pilot sites.", measurementFramework: "Monthly agency spend vs baseline.", modelMonitoringStrategy: "Weekly forecast accuracy review.", userTestingFeedback: "Managers enthusiastic. Accuracy in testing: 87% within 10%.", valueProofPoints: "Pilot at 3 sites: 28% agency hour reduction confirmed." },
        G4: {
          apiDocumentation: "HR system integration API documented and in production.",
          qualityControls: "Daily data validation checks. Automated alerts for forecast deviations >15%.",
          ipProtection: "Model code in secure repository. Access controls implemented.",
          disasterRecoveryPlan: "Manual scheduling fallback process documented for all sites.",
          orgModel: "Workforce Analytics team of 2 established within HR.",
          changeDeliveryStrategy: "Site manager training completed for all 12 sites. Monthly champions network established.",
          adoptionMetrics: "Daily active users: 87% of site managers. Dashboard engagement: 95% viewing forecasts before scheduling.",
          valueCreationMilestones: "Month 1: 22% reduction. Month 2: 26% reduction. Month 3: 29% reduction – tracking to target.",
          governanceSetup: "Monthly value steering committee. Quarterly model refresh cycle agreed."
        }
      },
      history: [
        { id: generateId(), type: "gate_decision", fromStage: "G2", toStage: "G3", decision: "approved", comment: "Pilot design is robust. Advance to build.", actionsRequired: [], decidedBy: "Gate Reviewer", decidedAt: daysAgo(120) },
        { id: generateId(), type: "gate_decision", fromStage: "G3", toStage: "G4", decision: "approved", comment: "28% reduction on pilot is excellent validation. Full rollout approved.", actionsRequired: ["Ensure all site managers trained before rollout"], decidedBy: "Gate Reviewer", decidedAt: daysAgo(60) },
        { id: generateId(), type: "stage_submission", fromStage: "G3", toStage: "G4", decision: null, comment: "Full deployment complete. 3-month tracking underway. Submitted for G4 review.", actionsRequired: [], decidedBy: "Claire Fontaine", decidedAt: daysAgo(15) }
      ],
      documents: [],
      tags: ["Workforce", "Forecasting", "Cost Reduction"]
    },
    {
      id: generateId(),
      title: "Automated Compliance Reporting",
      owner: "Daniel Park",
      businessUnit: "Finance",
      description: "Automated regulatory and management reporting platform to replace manual compliance reporting process, reducing cost and improving accuracy.",
      stage: "G5",
      createdAt: daysAgo(300),
      updatedAt: daysAgo(20),
      valueEstimates: { G0: 4.0, G1: 5.0, G2: 5.2, G3: 5.3, G4: 5.5, G5: 5.5 },
      stageData: {
        G0: { problemStatement: "Manual compliance reporting requires 12 FTE and £2.2M annually. High error rate leads to regulatory risk.", hypothesis: "Automation can eliminate 80% of manual effort and materially reduce regulatory risk.", sponsor: "Michelle Wong, CFO", dataAvailable: "Yes" },
        G1: { businessProblem: "£2.2M annual cost, 3 audit findings in last 2 years due to reporting errors.", workflow: "Monthly: data pull from 6 systems → manual reconciliation → 40+ manual reports", hypothesis: "Automated ingestion, reconciliation and reporting eliminates manual steps.", tshirtCostSize: "L", tshirtValueSize: "XL", technicalFeasibility: "Medium", dataFeasibility: "High", peopleImpact: "10 FTE redeployment", riskAssessment: "Regulatory approval for new reporting format required" },
        G2: { mvpScope: "Phase 1: Top 10 regulatory reports automated.", businessCaseNarrative: "£5.2M NPV over 5 years. £1.4M annual saving plus £200K risk mitigation.", deliveryRoadmap: "Q1-Q2 build, Q3 UAT, Q4 go-live.", phaseBreakdown: "Investment £800K total.", mvpDescription: "", userStrategy: "", dataFeasibilityDetail: "", dataReadinessPlan: "", technicalReadiness: "", orgReadiness: "", expertReviewNotes: "" },
        G3: { dataSourced: "All 6 source systems connected.", platformAccess: "Regulatory reporting platform licensed.", mvpDescription: "Automated data pipeline, reconciliation engine, report generation and distribution.", okrs: "OKR1: 100% regulatory reports automated with zero manual intervention.", measurementFramework: "Error rate vs baseline. Hours saved per month.", modelMonitoringStrategy: "Daily reconciliation checks with CFO exception dashboard.", userTestingFeedback: "Finance team: dramatic time saving. Audit team: much more confident in data.", valueProofPoints: "3 months pilot: zero errors vs 4 errors in same period baseline." },
        G4: { apiDocumentation: "All system integration APIs documented.", qualityControls: "Automated reconciliation checks on every run. Dual sign-off for regulatory submissions.", ipProtection: "Proprietary report templates protected.", disasterRecoveryPlan: "Manual fallback with 24hr SLA documented.", orgModel: "2 FTE Reporting Analytics team established.", changeDeliveryStrategy: "Full training complete. 10 FTE redeployed to value-add analysis roles.", adoptionMetrics: "100% of reports automated. 0 manual interventions in last 60 days.", valueCreationMilestones: "Month 1: 8 FTE freed. Month 2: All 10 reports live. Month 3: £350K run-rate saving confirmed.", governanceSetup: "Quarterly model review. CFO quarterly sign-off on accuracy." },
        G5: {
          financeEvidence: "3 months of financial system data showing £350K/quarter saving confirmed. 10 FTE redeployment completed and headcount costs removed from cost centre.",
          threeMonthData: "Months 1-3 actual saving: £1.05M vs £1.05M forecast. 100% on track.",
          signOffDate: daysAgo(20),
          signOffBy: "Michelle Wong, CFO",
          actualVsForecast: "£1.05M actual vs £1.05M forecast (100% delivery). Annualised run-rate: £1.4M – in line with business case.",
          lessonsLearned: "Key success factors: strong finance sponsorship, dedicated FTE for build, phased approach. Recommendation: apply same approach to management reporting."
        }
      },
      history: [
        { id: generateId(), type: "gate_decision", fromStage: "G3", toStage: "G4", decision: "approved", comment: "Zero errors in pilot is compelling. Full deployment approved.", actionsRequired: [], decidedBy: "Gate Reviewer", decidedAt: daysAgo(150) },
        { id: generateId(), type: "gate_decision", fromStage: "G4", toStage: "G5", decision: "approved", comment: "Exceptional delivery. All KPIs exceeded. Advance to benefits realisation.", actionsRequired: ["3-month Finance sign-off evidence required to bank value"], decidedBy: "Gate Reviewer", decidedAt: daysAgo(90) },
        { id: generateId(), type: "stage_submission", fromStage: "G4", toStage: "G5", decision: null, comment: "3 months evidence gathered. Finance sign-off obtained. Submitted for G5 gate.", actionsRequired: [], decidedBy: "Daniel Park", decidedAt: daysAgo(20) }
      ],
      documents: [],
      tags: ["Compliance", "Finance", "Automation"]
    },
    {
      id: generateId(),
      title: "Legacy ERP Migration",
      owner: "James Whitfield",
      businessUnit: "IT",
      description: "Migration from legacy ERP system to modern cloud platform, eliminating technical debt and enabling digital transformation across finance, HR and supply chain.",
      stage: "Banked",
      createdAt: daysAgo(500),
      updatedAt: daysAgo(90),
      valueEstimates: { G0: 6.0, G1: 7.0, G2: 8.5, G3: 8.0, G4: 8.2, G5: 7.8, Banked: 7.4 },
      stageData: {
        G0: { problemStatement: "Legacy ERP costing £3M/yr in maintenance and blocking digital initiatives.", hypothesis: "Cloud ERP migration delivers £5M+ NPV and enables £10M+ in follow-on digital value.", sponsor: "CEO & CFO joint sponsor", dataAvailable: "Yes" },
        G5: { financeEvidence: "Finance confirmed £7.4M value over 3 years.", threeMonthData: "Post-migration: £900K/quarter saving vs £925K forecast. Minor delays in Year 1 adoption reduced realised value vs plan.", signOffDate: daysAgo(100), signOffBy: "Michelle Wong, CFO", actualVsForecast: "£7.4M actual vs £7.8M forecast (95% delivery). Strong outcome given programme complexity.", lessonsLearned: "Data migration complexity underestimated. Budget a full data cleanse phase in future ERP projects. Change management was key success factor." },
        Banked: { realisedDate: daysAgo(90), realisedValue: 7.4, notes: "Value banked and confirmed in financial statements. £7.4M over 3 years vs £8.0M forecast – 93% delivery. Variance explained by 6-week delay in Finance module go-live." }
      },
      history: [
        { id: generateId(), type: "gate_decision", fromStage: "G4", toStage: "G5", decision: "approved", comment: "Programme delivered on time and near budget. Advance to benefits realisation.", actionsRequired: [], decidedBy: "Gate Reviewer", decidedAt: daysAgo(180) },
        { id: generateId(), type: "gate_decision", fromStage: "G5", toStage: "Banked", decision: "approved", comment: "£7.4M confirmed by Finance. 95% of forecast delivered. Value banked.", actionsRequired: [], decidedBy: "Gate Reviewer", decidedAt: daysAgo(90) }
      ],
      documents: [],
      tags: ["ERP", "IT", "Digital Transformation"]
    },
    {
      id: generateId(),
      title: "Manual Invoicing Automation",
      owner: "Sophie Laurent",
      businessUnit: "Finance",
      description: "RPA solution to automate manual invoice processing and three-way matching to reduce processing cost and improve payment accuracy.",
      stage: "Rejected",
      createdAt: daysAgo(90),
      updatedAt: daysAgo(45),
      valueEstimates: { G0: 2.5, G1: 2.1 },
      stageData: {
        G0: { problemStatement: "500 invoices/day processed manually at £4/invoice = £750K/yr. High error rate causing supplier relationship issues.", hypothesis: "RPA can automate 80% of invoices, saving £600K/yr.", sponsor: "Michelle Wong, CFO", dataAvailable: "Yes" },
        G1: { businessProblem: "Manual processing is expensive and error-prone. However, new ERP system (just migrated) has built-in invoice automation capabilities not yet activated.", workflow: "Invoice receipt → manual matching → approval → payment", hypothesis: "RPA on legacy process – but new ERP capability may make this redundant.", tshirtCostSize: "M", tshirtValueSize: "M", technicalFeasibility: "Low – new ERP has native capability that should be leveraged instead", dataFeasibility: "High", peopleImpact: "3 FTE redeployment", riskAssessment: "HIGH: Building RPA on top of new ERP native capability is wasteful duplication. Recommend using ERP native workflow instead." }
      },
      history: [
        { id: generateId(), type: "gate_decision", fromStage: "G0", toStage: "G1", decision: "approved", comment: "Worth a G1 scoping to validate approach.", actionsRequired: ["Check if new ERP has native invoicing automation"], decidedBy: "Gate Reviewer", decidedAt: daysAgo(75) },
        { id: generateId(), type: "gate_decision", fromStage: "G1", toStage: null, decision: "rejected", comment: "G1 scoping has revealed that the new ERP system has native invoice automation capabilities that have not yet been activated. Building a bespoke RPA solution over the top of this would be wasteful duplication. Initiative is rejected in favour of activating ERP native capability, which should be treated as a separate BAU project.", actionsRequired: [], decidedBy: "Gate Reviewer", decidedAt: daysAgo(45) }
      ],
      documents: [],
      tags: ["RPA", "Finance", "Automation"]
    }
  ]
}
