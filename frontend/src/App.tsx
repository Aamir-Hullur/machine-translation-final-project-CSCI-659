import { ModeToggle } from "./components/mode-toggle";
import { TranslationComparison } from "./components/TranslateComparison";
import { NavBarDemo } from "./components/ui/tubelight-navbar-demo";

const App = () => {
	return (
		<div className="min-h-screen bg-background transition-colors duration-300">
			<div className="container mx-auto py-8">
				<div className="flex justify-end mb-10">
					<NavBarDemo />
          {/* <ModeToggle /> */}
				</div>
			</div>
      <div>
      <h1 className="text-3xl font-bold text-center mb-8 relative z-50">
					Translation Comparison
				</h1>
        <TranslationComparison />
      </div>
		</div>
	);
};

export default App;
