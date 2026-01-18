import { useEffect, useState, useRef } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Footer from '@components/Footer'
import styles from '@components/MastHead.module.css'

export default function Demo() {
    const [tasks, setTasks] = useState([])
    const [currentTaskIndex, setCurrentTaskIndex] = useState(0)
    const [currentStepIndex, setCurrentStepIndex] = useState(0)
    const [isPlaying, setIsPlaying] = useState(false)
    const [playSpeed, setPlaySpeed] = useState(1500)
    const [summary, setSummary] = useState(null)
    const playIntervalRef = useRef(null)

    useEffect(() => {
        // Load benchmark data
        async function loadData() {
            try {
                const summaryRes = await fetch('/benchmark-data/summary.json')
                const summaryData = await summaryRes.json()
                setSummary(summaryData)

                // Load task data
                const taskPromises = summaryData.tasks.map(async (taskInfo) => {
                    const taskRes = await fetch(`/benchmark-data/tasks/${taskInfo.task_id}/task.json`)
                    const execRes = await fetch(`/benchmark-data/tasks/${taskInfo.task_id}/execution.json`)

                    const task = await taskRes.json()
                    const execution = await execRes.json()

                    return {
                        ...taskInfo,
                        definition: task,
                        execution: execution,
                        screenshots: execution.steps.map(step =>
                            `/benchmark-data/tasks/${taskInfo.task_id}/${step.screenshot_path}`
                        )
                    }
                })

                const loadedTasks = await Promise.all(taskPromises)
                setTasks(loadedTasks)
            } catch (error) {
                console.error('Failed to load benchmark data:', error)
            }
        }

        loadData()
    }, [])

    useEffect(() => {
        // Handle play/pause
        if (isPlaying) {
            playIntervalRef.current = setInterval(() => {
                setCurrentStepIndex(prev => {
                    const task = tasks[currentTaskIndex]
                    if (!task || !task.execution) return prev

                    const maxSteps = task.execution.steps.length - 1
                    if (prev >= maxSteps) {
                        setIsPlaying(false)
                        return prev
                    }
                    return prev + 1
                })
            }, playSpeed)
        } else {
            if (playIntervalRef.current) {
                clearInterval(playIntervalRef.current)
            }
        }

        return () => {
            if (playIntervalRef.current) {
                clearInterval(playIntervalRef.current)
            }
        }
    }, [isPlaying, playSpeed, currentTaskIndex, tasks])

    const currentTask = tasks[currentTaskIndex]
    const currentStep = currentTask?.execution?.steps?.[currentStepIndex]
    const currentScreenshot = currentTask?.screenshots?.[currentStepIndex]

    const handlePrevStep = () => {
        setCurrentStepIndex(prev => Math.max(0, prev - 1))
        setIsPlaying(false)
    }

    const handleNextStep = () => {
        const maxSteps = currentTask?.execution?.steps?.length - 1 || 0
        setCurrentStepIndex(prev => Math.min(maxSteps, prev + 1))
        setIsPlaying(false)
    }

    const handlePlayPause = () => {
        setIsPlaying(!isPlaying)
    }

    const formatAction = (action) => {
        if (!action) return 'No action'

        switch (action.type) {
            case 'click':
                return `CLICK at (${(action.x * 100).toFixed(1)}%, ${(action.y * 100).toFixed(1)}%)`
            case 'type':
                return `TYPE "${action.text}"`
            case 'key':
                return `KEY ${action.key}`
            case 'scroll':
                return `SCROLL ${action.scroll_direction}`
            default:
                return action.raw_action?.code || action.type
        }
    }

    return (
        <>
            <Head>
                <title>Interactive Demo - OpenAdapt.AI</title>
                <meta name="description" content="See OpenAdapt AI agents in action with real benchmark evaluations" />
            </Head>

            <div className={styles.section}>
                {/* Header */}
                <div className="relative z-30 py-10 px-4 text-center">
                    <h1 className="text-5xl md:text-6xl font-bold mb-4">
                        <span className="font-thin">Open</span>Adapt<span className="font-thin">.AI</span>
                    </h1>
                    <h2 className="text-3xl font-light mb-6">
                        Interactive Demo
                    </h2>
                    <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8">
                        Watch AI agents perform real tasks on Windows.
                        These are actual benchmark evaluations showing screenshots, actions, and execution logs.
                    </p>
                    <Link href="/" className="btn btn-outline btn-sm">
                        ← Back to Home
                    </Link>
                </div>

                {/* Main Demo Viewer */}
                <div className="container mx-auto px-4 pb-12 max-w-6xl">
                    {!summary ? (
                        <div className="text-center py-20">
                            <div className="loading loading-spinner loading-lg text-primary"></div>
                            <p className="mt-4 text-gray-400">Loading benchmark data...</p>
                        </div>
                    ) : (
                        <>
                            {/* Summary Stats */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                <div className="bg-base-200 p-4 rounded-lg border border-base-300">
                                    <div className="text-sm text-gray-400 uppercase">Tasks</div>
                                    <div className="text-3xl font-bold text-primary">{summary.num_tasks}</div>
                                </div>
                                <div className="bg-base-200 p-4 rounded-lg border border-base-300">
                                    <div className="text-sm text-gray-400 uppercase">Success Rate</div>
                                    <div className="text-3xl font-bold">{(summary.success_rate * 100).toFixed(0)}%</div>
                                </div>
                                <div className="bg-base-200 p-4 rounded-lg border border-base-300">
                                    <div className="text-sm text-gray-400 uppercase">Avg Steps</div>
                                    <div className="text-3xl font-bold">{summary.avg_steps.toFixed(1)}</div>
                                </div>
                                <div className="bg-base-200 p-4 rounded-lg border border-base-300">
                                    <div className="text-sm text-gray-400 uppercase">Avg Time</div>
                                    <div className="text-3xl font-bold">{summary.avg_time_seconds.toFixed(0)}s</div>
                                </div>
                            </div>

                            {/* Viewer */}
                            {currentTask && (
                                <div className="bg-base-200 rounded-xl border border-base-300 overflow-hidden">
                                    {/* Task Header */}
                                    <div className="bg-base-300 px-6 py-4 border-b border-base-300">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <h3 className="text-xl font-semibold">
                                                    {currentTask.definition.task_id}
                                                </h3>
                                                <p className="text-sm text-gray-400">
                                                    Domain: {currentTask.definition.domain}
                                                </p>
                                            </div>
                                            <div className={`badge ${currentTask.success ? 'badge-success' : 'badge-error'}`}>
                                                {currentTask.success ? 'Success' : 'Failed'}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Screenshot Viewer */}
                                    <div className="relative bg-black aspect-video">
                                        {currentScreenshot ? (
                                            <img
                                                src={currentScreenshot}
                                                alt={`Step ${currentStepIndex}`}
                                                className="w-full h-full object-contain"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full">
                                                <p className="text-gray-500">No screenshot available</p>
                                            </div>
                                        )}

                                        {/* Step indicator overlay */}
                                        <div className="absolute top-4 left-4 bg-black bg-opacity-75 px-3 py-2 rounded-lg">
                                            <span className="text-sm font-mono">
                                                Step {currentStepIndex + 1} / {currentTask.execution.steps.length}
                                            </span>
                                        </div>

                                        {/* Click indicator overlay */}
                                        {currentStep?.action?.type === 'click' && (
                                            <div
                                                className="absolute w-8 h-8 border-4 border-red-500 rounded-full animate-ping"
                                                style={{
                                                    left: `${currentStep.action.x * 100}%`,
                                                    top: `${currentStep.action.y * 100}%`,
                                                    transform: 'translate(-50%, -50%)'
                                                }}
                                            />
                                        )}
                                    </div>

                                    {/* Controls */}
                                    <div className="px-6 py-4 bg-base-300">
                                        <div className="flex items-center gap-4 mb-4">
                                            <button
                                                className="btn btn-sm btn-circle"
                                                onClick={handlePrevStep}
                                                disabled={currentStepIndex === 0}
                                            >
                                                ←
                                            </button>
                                            <button
                                                className={`btn btn-sm ${isPlaying ? 'btn-warning' : 'btn-primary'}`}
                                                onClick={handlePlayPause}
                                            >
                                                {isPlaying ? 'Pause' : 'Play'}
                                            </button>
                                            <button
                                                className="btn btn-sm btn-circle"
                                                onClick={handleNextStep}
                                                disabled={currentStepIndex >= currentTask.execution.steps.length - 1}
                                            >
                                                →
                                            </button>

                                            {/* Progress bar */}
                                            <div className="flex-1">
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max={currentTask.execution.steps.length - 1}
                                                    value={currentStepIndex}
                                                    onChange={(e) => setCurrentStepIndex(parseInt(e.target.value))}
                                                    className="range range-xs range-primary"
                                                />
                                            </div>

                                            {/* Speed control */}
                                            <select
                                                className="select select-sm select-bordered"
                                                value={playSpeed}
                                                onChange={(e) => setPlaySpeed(parseInt(e.target.value))}
                                            >
                                                <option value="500">2x</option>
                                                <option value="1000">1x</option>
                                                <option value="1500">0.5x</option>
                                                <option value="2000">0.25x</option>
                                            </select>
                                        </div>

                                        {/* Action details */}
                                        <div className="bg-base-100 rounded-lg p-4">
                                            <div className="font-mono text-sm">
                                                <div className="text-gray-400 mb-1">Action:</div>
                                                <div className="text-primary font-semibold">
                                                    {formatAction(currentStep?.action)}
                                                </div>
                                                {currentStep?.reasoning && (
                                                    <>
                                                        <div className="text-gray-400 mt-2 mb-1">Reasoning:</div>
                                                        <div className="text-gray-300">{currentStep.reasoning}</div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Task navigation */}
                                    {tasks.length > 1 && (
                                        <div className="px-6 py-4 border-t border-base-300">
                                            <div className="flex gap-2 flex-wrap">
                                                {tasks.map((task, idx) => (
                                                    <button
                                                        key={task.task_id}
                                                        className={`btn btn-sm ${idx === currentTaskIndex ? 'btn-primary' : 'btn-ghost'}`}
                                                        onClick={() => {
                                                            setCurrentTaskIndex(idx)
                                                            setCurrentStepIndex(0)
                                                            setIsPlaying(false)
                                                        }}
                                                    >
                                                        {task.task_id}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Call to Action */}
                            <div className="mt-12 text-center bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-xl p-8 border border-blue-500/20">
                                <h3 className="text-2xl font-semibold mb-4">
                                    Ready to Build Your Own AI Agents?
                                </h3>
                                <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                                    OpenAdapt.AI makes it easy to record demonstrations, train models, and deploy agents that can use any software.
                                </p>
                                <div className="flex gap-4 justify-center flex-wrap">
                                    <a
                                        href="https://docs.openadapt.ai"
                                        className="btn btn-primary"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Read the Docs
                                    </a>
                                    <a
                                        href="https://github.com/OpenAdaptAI/OpenAdapt"
                                        className="btn btn-outline"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        View on GitHub
                                    </a>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <Footer />

            <style jsx>{`
                .container {
                    color: var(--text-primary, #f0f0f0);
                }
            `}</style>
        </>
    )
}
