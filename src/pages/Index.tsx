
const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center space-y-8">
        <h1 className="text-4xl font-bold mb-4">Welcome to Club Management</h1>
        <p className="text-xl text-gray-600">Manage your club members and items efficiently</p>
        <div className="flex gap-4 justify-center">
          <a
            href="/members"
            className="text-blue-500 hover:text-blue-700 text-lg font-semibold"
          >
            Go to Members →
          </a>
          <a
            href="/items"
            className="text-blue-500 hover:text-blue-700 text-lg font-semibold"
          >
            Go to Items →
          </a>
        </div>
      </div>
    </div>
  );
};

export default Index;
