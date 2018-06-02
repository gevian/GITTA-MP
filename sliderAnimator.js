function SliderAnimator(controls)
{
	this.controls = controls;
	
	this.instructions = [];
	this.duration = null;
	
	this.state = "Waiting";
}


SliderAnimator.prototype.startAnimations = function(instructions, duration)
{
	this.controls.disableForms(false);
	this.instructions = instructions;
	this.duration = duration;
	
	for ( var i = 0; i < this.instructions.length; i++)
	{
		var instruction = this.instructions[i];
		instruction.changePerSecond = (instruction.target - instruction.slider.value) / duration;
		instruction.finished = false;
	}
	
	this.state = "Animating";
}


// TODO: Improve increment for large step values; currently it breaks the target animation time
SliderAnimator.prototype.update = function(delta)
{
	var allFinished = true;
	
	if (this.state == "Animating")
	{
		for (var i = 0; i < this.instructions.length; i++)
		{
			var instruction = this.instructions[i];
			if (instruction.finished)
				continue
			
			var allFinished = false;
			
			var deltaValue = delta * instruction.changePerSecond;
			var increment =  Math.round(deltaValue / Number(instruction.slider.step)) * instruction.slider.step;

			if (increment == 0)
			{
				if (instruction.changePerSecond > 0)
					increment = Number(instruction.slider.step);
				else
					increment = -Number(instruction.slider.step);
			}
			
			instruction.slider.value = Number(instruction.slider.value) + increment;


			if (instruction.changePerSecond >= 0 && instruction.slider.value >= instruction.target)
			{
				instruction.slider.value = instruction.target;
				instruction.finished = true;
			}
			else if (instruction.changePerSecond <= 0 && instruction.slider.value <= instruction.target)
			{
				instruction.slider.value = instruction.target;
				instruction.finished = true;
			}
			
			instruction.slider.oninput();
		}
		
		if (allFinished)
		{
			this.state = "Waiting";
			this.controls.enableForms(false);
		}
			
	}
}
