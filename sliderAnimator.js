function SliderAnimator(controls, surface)
{
	this.controls = controls;
    this.surface = surface;
    
	this.instructions = [];
	this.duration = null;
	
	this.state = "Rolled";
}


SliderAnimator.prototype.startSliderAnimations = function(instructions, duration)
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
	
	this.state = "Animating Sliders";
}


// TODO: Improve increment for large step values; currently it breaks the target animation time
SliderAnimator.prototype.update = function(delta)
{	
	if (this.state == "Animating Sliders")
	{
        var allFinished = true;
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
			this.state = "Rolled";
			this.controls.enableForms(false);
		}
	}           
}
