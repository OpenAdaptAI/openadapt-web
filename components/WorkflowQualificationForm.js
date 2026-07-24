import { useRef, useState } from 'react'
import Link from 'next/link'

import {
    QUALIFICATION_TIERS,
    scoreWorkflowQualification,
} from '../lib/workflowQualification.mjs'
import { EVENTS, track } from '../utils/analytics'

const INITIAL_FORM = {
    name: '',
    email: '',
    company: '',
    role: '',
    application: '',
    applicationVersion: '',
    environment: '',
    workflow: '',
    monthlyVolume: '',
    manualTime: '',
    operators: '',
    errorConsequence: '',
    inputStructure: '',
    stability: '',
    writeApi: '',
    verifier: '',
    testEnvironment: '',
    dataSensitivity: '',
    deploymentRestrictions: '',
    economicBuyer: '',
    buyerAuthority: '',
    timeline: '',
    budget: '',
    reusePotential: '',
    botField: '',
}

const fieldClass =
    'rounded-lg border border-ink/30 bg-panel px-3 py-2 text-ink placeholder-ink-3/60 focus:border-accent focus:outline-none'

function SelectField({ label, name, value, onChange, children, required = true }) {
    return (
        <label className="flex flex-col gap-2 text-sm">
            {label}
            <select
                className={fieldClass}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
            >
                <option value="">Select one</option>
                {children}
            </select>
        </label>
    )
}

export default function WorkflowQualificationForm({ compact = false }) {
    const [form, setForm] = useState(INITIAL_FORM)
    const [state, setState] = useState('idle')
    const [result, setResult] = useState(null)
    const [error, setError] = useState('')
    const started = useRef(false)

    const markStarted = () => {
        if (started.current) return
        started.current = true
        track(EVENTS.QUALIFICATION_FORM_START, { location: compact ? 'home' : 'qualify' })
    }

    const handleChange = (event) => {
        markStarted()
        const { name, value } = event.target
        setForm((current) => ({ ...current, [name]: value }))
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        setState('submitting')
        setError('')

        const qualification = scoreWorkflowQualification(form)
        const data = new URLSearchParams()
        data.set('form-name', 'workflow-qualification')
        for (const [key, value] of Object.entries(form)) {
            data.set(key === 'botField' ? 'bot-field' : key, value)
        }
        data.set('qualificationScore', String(qualification.score))
        data.set('qualificationTier', qualification.tier)

        try {
            const response = await fetch('/form.html', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: data.toString(),
            })
            if (!response.ok) {
                throw new Error(`Form submission failed with status ${response.status}`)
            }

            track(EVENTS.QUALIFICATION_FORM_SUBMIT, {
                tier: qualification.tier,
                location: compact ? 'home' : 'qualify',
            })
            if (qualification.tier === 'priority') {
                track(EVENTS.QUALIFIED_WORKFLOW, { tier: 'priority' })
            }
            setResult(qualification)
            setState('submitted')
        } catch (submitError) {
            console.error(submitError)
            setError('Submission failed. Please email hello@openadapt.ai.')
            setState('idle')
        }
    }

    if (state === 'submitted') {
        const next = QUALIFICATION_TIERS[result.tier]
        const external = next.href.startsWith('http')
        return (
            <div className="rounded-2xl border border-accent/40 bg-panel p-6 md:p-8">
                <p className="eyebrow">Submission received</p>
                <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink">
                    {next.heading}
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-2">
                    {next.message}
                </p>
                <div className="mt-6">
                    {external ? (
                        <a
                            href={next.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-ink"
                        >
                            {next.action}
                        </a>
                    ) : (
                        <Link href={next.href} className="btn-ink">
                            {next.action}
                        </Link>
                    )}
                </div>
            </div>
        )
    }

    return (
        <form
            name="workflow-qualification"
            data-netlify="true"
            netlify-honeypot="bot-field"
            onSubmit={handleSubmit}
            className="space-y-7"
        >
            <input type="hidden" name="form-name" value="workflow-qualification" />
            <input
                className="hidden"
                aria-hidden="true"
                tabIndex={-1}
                autoComplete="off"
                name="bot-field"
                value={form.botField}
                onChange={handleChange}
            />

            <fieldset>
                <legend className="font-display text-lg font-semibold text-ink">
                    You and the application
                </legend>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <label className="flex flex-col gap-2 text-sm">
                        Name *
                        <input className={fieldClass} name="name" required value={form.name} onChange={handleChange} autoComplete="name" />
                    </label>
                    <label className="flex flex-col gap-2 text-sm">
                        Work email *
                        <input className={fieldClass} name="email" type="email" required value={form.email} onChange={handleChange} autoComplete="email" />
                    </label>
                    <label className="flex flex-col gap-2 text-sm">
                        Company *
                        <input className={fieldClass} name="company" required value={form.company} onChange={handleChange} autoComplete="organization" />
                    </label>
                    <label className="flex flex-col gap-2 text-sm">
                        Role *
                        <input className={fieldClass} name="role" required value={form.role} onChange={handleChange} autoComplete="organization-title" />
                    </label>
                    <label className="flex flex-col gap-2 text-sm">
                        Application *
                        <input className={fieldClass} name="application" required value={form.application} onChange={handleChange} placeholder="Epic Hyperspace, Encompass, SAP…" />
                    </label>
                    <label className="flex flex-col gap-2 text-sm">
                        Application version
                        <input className={fieldClass} name="applicationVersion" value={form.applicationVersion} onChange={handleChange} placeholder="If known" />
                    </label>
                    <SelectField label="Execution environment *" name="environment" value={form.environment} onChange={handleChange}>
                        <option value="browser">Browser</option>
                        <option value="windows">Windows</option>
                        <option value="macos">macOS</option>
                        <option value="linux">Linux</option>
                        <option value="rdp">RDP</option>
                        <option value="citrix">Citrix</option>
                        <option value="mixed">Mixed surfaces</option>
                    </SelectField>
                    <SelectField label="Expected data sensitivity *" name="dataSensitivity" value={form.dataSensitivity} onChange={handleChange}>
                        <option value="ordinary">Ordinary business data</option>
                        <option value="personal">Personal information</option>
                        <option value="regulated">Regulated or clinical data</option>
                        <option value="restricted">Highly restricted</option>
                    </SelectField>
                </div>
            </fieldset>

            <fieldset>
                <legend className="font-display text-lg font-semibold text-ink">
                    One exact workflow
                </legend>
                <p className="mt-2 text-xs leading-relaxed text-ink-3">
                    Describe the business steps, not real customer or patient data. Do not paste screenshots, credentials, record identifiers, or sensitive values.
                </p>
                <label className="mt-4 flex flex-col gap-2 text-sm">
                    What should happen from input to verified result? *
                    <textarea className={fieldClass} name="workflow" rows={5} required value={form.workflow} onChange={handleChange} placeholder="Example: read a structured eligibility response, enter the approved fields into the legacy application, then reopen the record and confirm the persisted values." />
                </label>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <SelectField label="Monthly executions *" name="monthlyVolume" value={form.monthlyVolume} onChange={handleChange}>
                        <option value="under_100">Under 100</option>
                        <option value="100_999">100–999</option>
                        <option value="1000_4999">1,000–4,999</option>
                        <option value="5000_plus">5,000+</option>
                    </SelectField>
                    <SelectField label="Manual minutes per execution *" name="manualTime" value={form.manualTime} onChange={handleChange}>
                        <option value="under_5">Under 5</option>
                        <option value="5_15">5–15</option>
                        <option value="16_60">16–60</option>
                        <option value="over_60">Over 60</option>
                    </SelectField>
                    <label className="flex flex-col gap-2 text-sm">
                        Operators doing this work *
                        <input className={fieldClass} name="operators" required value={form.operators} onChange={handleChange} placeholder="Example: 8 billing specialists" />
                    </label>
                    <SelectField label="Cost of a wrong action *" name="errorConsequence" value={form.errorConsequence} onChange={handleChange}>
                        <option value="low">Low / easily reversible</option>
                        <option value="operational">Operational disruption</option>
                        <option value="financial">Material financial impact</option>
                        <option value="regulated">Compliance, safety, or regulated impact</option>
                    </SelectField>
                    <SelectField label="Input structure *" name="inputStructure" value={form.inputStructure} onChange={handleChange}>
                        <option value="open_ended">Mostly open-ended judgment</option>
                        <option value="mixed">Mixed structured and judgment-based</option>
                        <option value="mostly_structured">Mostly structured</option>
                        <option value="structured">Fully structured</option>
                    </SelectField>
                    <SelectField label="Workflow stability *" name="stability" value={form.stability} onChange={handleChange}>
                        <option value="changes_weekly">Changes weekly</option>
                        <option value="changes_monthly">Changes monthly</option>
                        <option value="stable_quarter">Stable for a quarter</option>
                        <option value="stable_year">Stable for a year or more</option>
                    </SelectField>
                </div>
            </fieldset>

            <fieldset>
                <legend className="font-display text-lg font-semibold text-ink">
                    Integration and proof
                </legend>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <SelectField label="Practical write API *" name="writeApi" value={form.writeApi} onChange={handleChange}>
                        <option value="supported">A reliable supported write API exists</option>
                        <option value="incomplete">An API exists but cannot complete the workflow</option>
                        <option value="unavailable">No practical write API</option>
                    </SelectField>
                    <SelectField label="Strongest available result verifier *" name="verifier" value={form.verifier} onChange={handleChange}>
                        <option value="independent_interface">API, database, audit feed, or report</option>
                        <option value="independent_session">Separate read-only account or session</option>
                        <option value="persisted_reacquisition">Leave, search, reopen, and re-read the record</option>
                        <option value="screen">Immediate screen confirmation only</option>
                        <option value="none">No meaningful verifier identified</option>
                    </SelectField>
                    <SelectField label="Test environment *" name="testEnvironment" value={form.testEnvironment} onChange={handleChange}>
                        <option value="ready">Ready now</option>
                        <option value="possible">Can be arranged</option>
                        <option value="unavailable">Not available</option>
                    </SelectField>
                    <SelectField label="Reuse potential *" name="reusePotential" value={form.reusePotential} onChange={handleChange}>
                        <option value="one_off">One-off workflow</option>
                        <option value="one_site">One team or site</option>
                        <option value="multiple_sites">Multiple teams or sites</option>
                        <option value="multiple_customers">Multiple customers</option>
                    </SelectField>
                    <label className="flex flex-col gap-2 text-sm md:col-span-2">
                        Deployment restrictions
                        <textarea className={fieldClass} name="deploymentRestrictions" rows={3} value={form.deploymentRestrictions} onChange={handleChange} placeholder="Private network, customer-managed keys, restricted egress, customer-controlled runner…" />
                    </label>
                </div>
            </fieldset>

            <fieldset>
                <legend className="font-display text-lg font-semibold text-ink">
                    Ownership and timing
                </legend>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <label className="flex flex-col gap-2 text-sm">
                        Named economic buyer
                        <input className={fieldClass} name="economicBuyer" value={form.economicBuyer} onChange={handleChange} placeholder="Name or role" />
                    </label>
                    <SelectField label="Buyer involvement *" name="buyerAuthority" value={form.buyerAuthority} onChange={handleChange}>
                        <option value="exploring">Exploring independently</option>
                        <option value="champion">Internal champion identified</option>
                        <option value="buyer_involved">Economic buyer is involved</option>
                        <option value="economic_buyer">I am the economic buyer</option>
                    </SelectField>
                    <SelectField label="Desired timeline *" name="timeline" value={form.timeline} onChange={handleChange}>
                        <option value="under_30">Under 30 days</option>
                        <option value="30_60">30–60 days</option>
                        <option value="60_90">60–90 days</option>
                        <option value="later">Later / researching</option>
                    </SelectField>
                    <SelectField label="Qualification budget *" name="budget" value={form.budget} onChange={handleChange}>
                        <option value="none">No budget identified</option>
                        <option value="under_15000">Under $15,000</option>
                        <option value="15000_40000">$15,000–$40,000</option>
                        <option value="over_40000">Over $40,000</option>
                    </SelectField>
                </div>
            </fieldset>

            {error && (
                <p role="alert" className="rounded-lg border border-red-800/40 bg-red-100 px-3 py-2 text-sm text-red-900">
                    {error}
                </p>
            )}

            <div className="flex flex-wrap items-center gap-4">
                <button
                    type="submit"
                    className="btn-ink disabled:cursor-wait disabled:opacity-60"
                    disabled={state === 'submitting'}
                >
                    {state === 'submitting' ? 'Submitting…' : 'Qualify one workflow'}
                </button>
                <p className="max-w-xl text-xs leading-relaxed text-ink-3">
                    This intake is for scope only. Do not submit credentials, screenshots, recordings, PHI, PII, or customer records.
                </p>
            </div>
        </form>
    )
}
