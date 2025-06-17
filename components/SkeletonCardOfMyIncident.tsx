export default function SkeletonCardOfMyIncident() {
    return (
        <div className="bg-white rounded-lg shadow-md p-6 animate-pulse space-y-4">
            <div className="h-5 bg-gray-300 rounded w-3/4" />
            <div className="h-4 bg-gray-300 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="h-3 bg-gray-200 rounded w-2/3" />
            <div className="h-3 bg-gray-200 rounded w-1/3" />
            <div className="h-10 bg-gray-300 rounded mt-4" />
        </div>
    )
}