function SliderAnimator(controls)
{
	this.controls = controls;
	
	this.instructions = [];
	this.duration = null;
	
	this.state = "Waiting";
}


SliderAnimator.prototype.startAnimations = function(instructions, duration)
{
	this.controls.disableForms();
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
			
			console.log(instruction.slider.id);
			
			var allFinished = false;
			
			var deltaValue = delta * instruction.changePerSecond;
			var increment = Number(instruction.slider.value) + deltaValue;
			instruction.slider.value = Math.round(increment / instruction.slider.step) * instruction.slider.step;
			
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
	}
	
	if (allFinished)
	{
		this.state = "Waiting";
		this.controls.enableForms();
	}
}
