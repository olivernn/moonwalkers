require 'rake'
require 'json'
require 'erb'
require 'open3'
require 'webrick'

class Template
  Bio = Struct.new(:id, :name, :body)

  def self.render(corpus_path, template_path)
    new(corpus_path, template_path).render
  end

  def initialize(corpus_path, template_path)
    @corpus_path = corpus_path
    @template_path = template_path
  end

  def bios
    corpus.map do |attrs|
      Bio.new(*attrs.values_at('id', 'name', 'body'))
    end
  end

  def render
    b = binding
    template.result(b)
  end

  private

  attr_reader :corpus_path, :template_path

  def corpus
    @corpus ||= JSON.parse(File.read(corpus_path))
  end

  def template
    @template ||= ERB.new(File.read(template_path))
  end
end

directory "docs"

file 'docs/corpus.json' => ['docs', *Rake::FileList['bios/*.txt']] do |t|
  corpus = t.sources.grep(/\.txt$/)
    .map do |path|
      {
        id: path.pathmap('%n'),
        name: path.pathmap('%n').gsub('_', ' '),
        body: File.read(path),
      }
    end

  File.open(t.name, 'w') do |f|
    f << JSON.generate(corpus)
  end
end

file 'docs/index.html' => ['docs/corpus.json', 'templates/index.html.erb'] do |t|
  File.open(t.name, 'w') do |f|
    f << Template.render(*t.sources)
  end
end

file 'docs/index.json' => ['docs/corpus.json'] do |t|
  Open3.popen2('./build-index') do |stdin, stdout, wt|
    IO.copy_stream(t.source, stdin)
    stdin.close
    IO.copy_stream(stdout, t.name)
  end
end

file 'docs/index.js' => [*Rake::FileList['src/*.js']] do |t|
  sh "./node_modules/.bin/webpack src/main.js #{t.name}"
end

file 'docs/main.css' => ['docs', 'styles/main.css'] do |t|
  cp 'styles/main.css', 'docs/main.css'
end

task :default => ['docs/index.json', 'docs/index.html', 'docs/index.js', 'docs/main.css']

task :server do
  WEBrick::HTTPServer.new(:Host => '0.0.0.0', :Port => 8000, :DocumentRoot => Dir.pwd + "/docs").start
end

task :clean do
  rm_rf 'docs'
end
