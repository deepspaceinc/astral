type Options = {
	region: string;
};

export const aws = {
	ecs(options: Options) {
		console.log('IN ECS:', options);
	},
};
